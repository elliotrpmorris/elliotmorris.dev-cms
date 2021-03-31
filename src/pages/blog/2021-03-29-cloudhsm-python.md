---
templateKey: blog-post
title: Communicating with a CloudHSM via PyKCS11
date: 2021-03-29T19:19:31.800Z
description: What is Nitro and why you should care about their enclaves.
featuredpost: true
featuredimage: /img/hsm.png
tags:
  - aws
  - python
---

## Introduction to CloudHSM

AWS CloudHSM is a cloud-based hardware security module (HSM) that enables you to easily generate and use your own encryption keys on the AWS Cloud.

**Warning! They are pricey as of March 2021 setting up a single HSM in a cluster costs 1.59 USD per HR.**

---

### Use case overview

---

As referenced in my last blog i am working with a large public sector client. So you can imagine how long some migrations can take Because of this we couldn't implement our solution using just KMS as they only support SHA256. We need to support both SHA256 and SHA1.

This is where CloudHSM comes in as this allows us to create and manage our own keys in a isolated HSM. While still keeping them in the 'cloud'.

### How do we create and manage keys?

To create and manage keys in the HSM we use PKCS#11 interface.

#### **So what is PKCS?**

These are a group of public-key cryptography standards devised and published by RSA Security LLC.

#### **PKCS#11**

The [PKCS#11](http://docs.oasis-open.org/pkcs11/pkcs11-base/v2.40/os/pkcs11-base-v2.40-os.html) standard defines a platform-independent API to cryptographic tokens, such as hardware security modules (HSM) and smart cards.

## Steps for setting up a CloudHSM cluster:

This assumes you have a AWS account with a VPC.

- [Create a EC2 using amazonlinux2 as the AMI](https://aws.amazon.com/amazon-linux-2/)
- [Create a cluster](https://docs.aws.amazon.com/cloudhsm/latest/userguide/create-cluster.html)
- [Initialize the cluster](https://docs.aws.amazon.com/cloudhsm/latest/userguide/initialize-cluster.html)
- [Activate the cluster](https://docs.aws.amazon.com/cloudhsm/latest/userguide/activate-cluster.html)
- Install and configure CloudHSM Client [Linux](https://docs.aws.amazon.com/cloudhsm/latest/userguide/install-and-configure-client-linux.html) / [Windows](https://docs.aws.amazon.com/cloudhsm/latest/userguide/install-and-configure-client-win.html)
- [Activate the cluster](https://docs.aws.amazon.com/cloudhsm/latest/userguide/activate-cluster.html)
- [Install PKCS#11 Library](https://docs.aws.amazon.com/cloudhsm/latest/userguide/pkcs11-library-install.html)

Once activated you can create a HSM in your cluster!

## HSM user types

### CO (Crypto officer)

A crypto officer (CO) can perform user management operations. For example, a CO can create and delete users and change user passwords.

When you activate a new cluster, the user changes from a Precrypto Officer (PRECO) to a crypto officer (CO).

> _Source - https://docs.aws.amazon.com/cloudhsm/latest/userguide/manage-hsm-users.html#crypto-officer_

We will already a CO we can use to create our CU now the cluster is activated.

### CU (Crypto user)

A crypto user (CU) can perform the following key management and cryptographic operations.

- Key management – Create, delete, share, import, and export cryptographic keys.
- Cryptographic operations – Use cryptographic keys for encryption, decryption, signing, verifying, and more.

> _Source - https://docs.aws.amazon.com/cloudhsm/latest/userguide/manage-hsm-users.html#crypto-user_

## Prerequisites for sample application

### Create a CU

- Ensure the HSM client is started

```
service cloudhsm-client start
```

- Start user management tool

```
 /opt/cloudhsm/bin/cloudhsm_mgmt_util /opt/cloudhsm/etc/cloudhsm_mgmt_util.cfg
```

- Login in with the previously created CO credentials

```
 loginHSM CO <user_name> <password>
```

- Create a CU

```
 createUser CU <user_name> <password>
```

Now you have a CU lets create a key pair!

### Create a RSA key pair for CU

- Start key management tool

```
/opt/cloudhsm/bin/key_mgmt_util
```

- Login as in the CU

```
loginHSM -u CU -s <user_name> -p <password>
```

- Create RSA keypair

```
 genRSAKeyPair -m 2048 -e 65541 -l rsa_test_key_pair -nex -attest
```

**_Note_:**

- `-nex` - Makes the private key nonextractable.
- `-attest` - Runs an integrity check that verifies that the firmware on which the cluster runs has not been tampered with.

### Install packages to EC2

The application will require these packages to be present:

```
yum install -y \
https://s3.amazonaws.com/cloudhsmv2-software/CloudHsmClient/EL7/cloudhsm-client-latest.el7.x86_64.rpm \
https://s3.amazonaws.com/cloudhsmv2-software/CloudHsmClient/EL7/cloudhsm-client-pkcs11-latest.el7.x86_64.rpm \
ncurses-compat-libs python3 python3-devel gcc gcc-c++ swig openssl

```

## Example application

In this example we will be using Python to access some keys stored in the CloudHSM and sign some data.

### PyKCS11

[PyKCS11](https://github.com/LudovicRousseau/PyKCS11) is a PKCS#11 Wrapper for Python

### Implementation overview

### Python code

```
"""CloudHSM Demo"""
import base64
import PyKCS11
from PyKCS11.LowLevel import CKF_RW_SESSION, CKA_CLASS, CKO_PRIVATE_KEY, CKM_SHA1_RSA_PKCS, CKM_SHA256_RSA_PKCS, \
                             CKM_SHA512_RSA_PKCS, CKO_PUBLIC_KEY


def request_signature():
    """
    Request the HSM for a signature of the payload.
    """
    # This should be your CU username and password formatted like this 'user_name:password'.
    hsm_credentials = 'user_name:password'
    # This will be the data you want to sign.
    payload = 'Sign me please.'

    session = create_hsm_session()

    private_key = login_hsm_get_key(
        session,
        hsm_credentials)

    signature = sign_payload(
        session,
        payload,
        private_key)

    session.logout()
    session.closeSession()

    print(base64.b64encode(bytes(signature)).decode("utf-8"))


def create_hsm_session():
    """
    Creates a HSM session and returns the session.

    :return: The HSM session.
    """
    # Load PKCS#11 LIB.
    pkcs11 = PyKCS11.PyKCS11Lib()
    pkcs11.load('opt/cloudhsm/lib/libcloudhsm_pkcs11.so')

    try:
        # Get first slot as CloudHSM only has one slot.
        slot = pkcs11.getSlotList()[0]

        # Create Session.
        session = pkcs11.openSession(slot, CKF_RW_SESSION)

        return session
    except PyKCS11.PyKCS11Error:
        return {"ERROR": "PKCS#11 Error when creating session."}


def login_hsm_get_key(session, credentials):
    """"
    Logs in to HSM with credentials returns users private key.

    :param session: The HSM session.
    :param credentials: The credentials to login to the HSM.

    :return: The users private key.
    """

    try:
        # Login to HSM.
        session.login(credentials)

        # Get private key for user.
        private_key = session.findObjects([(CKA_CLASS, CKO_PRIVATE_KEY)])[0]

        return private_key
    except PyKCS11.PyKCS11Error:
        return {
            "ERROR": "PKCS#11 Error when logging in and getting private key."
        }


def sign_payload(session, payload, private_key):
    """
    Signs a payload and returns a signed payload.

    :param session: The HSM session.
    :param payload: The payload to sign.
    :param private_key: The private key to use.

    :return: The signature.
    """
    try:
        mechanism = PyKCS11.Mechanism(CKM_SHA256_RSA_PKCS, None)
        signature = session.sign(private_key, payload, mechanism)

        return signature
    except PyKCS11.PyKCS11Error:
        return {"ERROR": "PKCS#11 Error when signing payload."}


if __name__ == "__main__":
    request_signature()

```

---

## Conclusion
