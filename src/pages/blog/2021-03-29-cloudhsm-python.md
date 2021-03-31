---
templateKey: blog-post
title: Python - Communicating with a CloudHSM/ 
date: 2021-03-29T19:19:31.800Z
description: How to sign data using keys stored in CloudHSM.
featuredpost: true
featuredimage: /img/hsm.png
tags:
  - aws
  - python
---

## Introduction to CloudHSM

AWS CloudHSM is a cloud-based hardware security module (HSM) that enables you to easily generate and use your own encryption keys on the AWS Cloud.

> **Warning! CloudHSM is pricey; as of March 2021 setting up a single HSM in a cluster costs 1.59 USD per HR.**


### Use case overview

---

As referenced in my last blog i am working with a large public sector client. So you can imagine how long some migrations can take. Because of this we couldn't implement our solution using just [AWS KMS](https://aws.amazon.com/kms/) as they only support SHA256. Unfortunately We need to support both SHA256 and SHA1.

This is where CloudHSM comes in as this allows us to create and manage our own keys in an isolated HSM. While still keeping them in the 'cloud'.

## What will you learn after this blog post?

I created this article off the back of countless hours researching how to use keys for cryptographic operations that are stored in a HSM. Of course there are lots of resources online. But not much is available in regards to AWS CloudHSM.

This blog post will show you how to successfully sign some data with a key from CloudHSM in python. 
#### __How do we create and manage keys in a HSM?__

To create and manage keys in the HSM we use PKCS#11 interface.

#### __So what is PKCS?__

These are a group of public-key cryptography standards devised and published by RSA Security LLC.

#### __PKCS#11__

The [PKCS#11](http://docs.oasis-open.org/pkcs11/pkcs11-base/v2.40/os/pkcs11-base-v2.40-os.html) standard defines a platform-independent API to cryptographic tokens, such as hardware security modules (HSM) and smart cards.

AWS CloudHSM offers an implementation of the [PKCS #11 library](https://docs.aws.amazon.com/cloudhsm/latest/userguide/pkcs11-library.html). Which is what we are going to use to interface with the HSM.

## Steps for setting up a CloudHSM cluster:

This assumes you have an AWS account with a VPC.

- [Create a EC2 using amazonlinux2 as the AMI](https://aws.amazon.com/amazon-linux-2/)
- [Create a cluster](https://docs.aws.amazon.com/cloudhsm/latest/userguide/create-cluster.html)
- [Initialize the cluster](https://docs.aws.amazon.com/cloudhsm/latest/userguide/initialize-cluster.html)
- [Activate the cluster](https://docs.aws.amazon.com/cloudhsm/latest/userguide/activate-cluster.html)
- Install and configure CloudHSM Client [Linux](https://docs.aws.amazon.com/cloudhsm/latest/userguide/install-and-configure-client-linux.html) / [Windows](https://docs.aws.amazon.com/cloudhsm/latest/userguide/install-and-configure-client-win.html)
- [Activate the cluster](https://docs.aws.amazon.com/cloudhsm/latest/userguide/activate-cluster.html)
- [Install PKCS#11 Library](https://docs.aws.amazon.com/cloudhsm/latest/userguide/pkcs11-library-install.html)

Once activated you can now create a HSM in your cluster!

## HSM user types

#### __CO (Crypto officer)__

A crypto officer (CO) can perform user management operations. For example, a CO can create and delete users and change user passwords.

When you activate a new cluster, the user changes from a Precrypto Officer (PRECO) to a crypto officer (CO).

> _Source - https://docs.aws.amazon.com/cloudhsm/latest/userguide/manage-hsm-users.html#crypto-officer_

We will already have a CO we can use to create our CU now the cluster is activated.

#### __CU (Crypto user)__

A crypto user (CU) can perform the following key management and cryptographic operations.

- Key management – Create, delete, share, import, and export cryptographic keys.
- Cryptographic operations – Use cryptographic keys for encryption, decryption, signing, verifying, and more.

> _Source - https://docs.aws.amazon.com/cloudhsm/latest/userguide/manage-hsm-users.html#crypto-user_

## Prerequisites for sample application

### Create a CU:

- Ensure the HSM client is started

```
/opt/cloudhsm/bin/cloudhsm_client /opt/cloudhsm/etc/cloudhsm_client.cfg &> /tmp/cloudhsm_client_start.log &
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

### Create a RSA key pair for the CU:

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

> `-m` - Specifies the length of the modulus in bits. The minimum value is 2048.

> `-e` - Specifies the public exponent.

> `-l` - Key pair label.

> `-nex` - Makes the private key nonextractable.

> `-attest` - Runs an integrity check that verifies that the firmware on which the cluster runs on has not been tampered with.

### Install packages to EC2
 The application will require these packages to be present

#### __Install yum packages:__
```
yum install -y \
https://s3.amazonaws.com/cloudhsmv2-software/CloudHsmClient/EL7/cloudhsm-client-latest.el7.x86_64.rpm \
https://s3.amazonaws.com/cloudhsmv2-software/CloudHsmClient/EL7/cloudhsm-client-pkcs11-latest.el7.x86_64.rpm \
ncurses-compat-libs python3 python3-devel gcc gcc-c++ swig openssl
```

#### __Install pip:__
```
curl -O https://bootstrap.pypa.io/get-pip.py && python3 get-pip.py
```

#### __Install python packages:__
```
pip3 install PyKCS11
```

## Example application
This application will sign the text 'Sign me please.' with the RSA private key we created in the HSM using SHA256.

The below code requires you to install the `PyKCS11` package. This is used to call functions in the CloudHSM PKCS#11 library.

### PyKCS11

[PyKCS11](https://github.com/LudovicRousseau/PyKCS11) is a PKCS#11 Wrapper for Python.


### The Python code

```
"""CloudHSM Demo"""
import base64
import PyKCS11
from PyKCS11.LowLevel import CKF_RW_SESSION, CKA_CLASS, CKO_PRIVATE_KEY, CKM_SHA256_RSA_PKCS


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
    pkcs11.load('/opt/cloudhsm/lib/libcloudhsm_pkcs11.so')

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
        # You can change this to desired mechanism such as 'CKM_SHA1_RSA_PKCS'
        mechanism = PyKCS11.Mechanism(CKM_SHA256_RSA_PKCS, None)
        signature = session.sign(private_key, payload, mechanism)

        return signature
    except PyKCS11.PyKCS11Error:
        return {"ERROR": "PKCS#11 Error when signing payload."}


if __name__ == "__main__":
    request_signature()

```

Copy this code into a file on your ec2

```
vi request_signature.py
```

To save and quit `ESC` then `:` then `wq!` 

Now run the code.

```
python3 request_signature.py
```

### Expected Response

```
VHi0Krvnmt8+fn9VXFWfrpHE9Uzq8M7s2gwektRmDkd9i6nOolGYEsW2HSL26l6IJYnrGmLDTuHHJKd7lSrtJNfEkensELgkPH0xXXdn6k512K0JHDn9ZyPipSBAbdV/RP16l6j4t7ZzFzAY07eJQjn+LzXQWQ/2U7XJGmHWVODOjDG6KZSr0hB/O3Oov8iyjIEkkhSwQTiKOu8IXtR8A0hrX+aeAMdprzGcj8le8XF6CoKgxWs7hPezmGn2DtWfUa56VMeJSqHTsbJfekC+ANSEm21S5btvvLkK2253UBqdvwuIt4c2UGS1ksB5hEyz9Q32mqJk0vegvbfKwwEsFA==
```
---

## Conclusion
You have now successfully signed some data using keys stored in a CloudHSM using Python and PKCS#11!

### Troubleshooting
If you come across the below error
```
Cfm3Initialize() returned 0x40000040 : LIQUIDSECURITY: Daemon socket connection error
```

Ensure you have started the CloudHSM client using the below command
```
/opt/cloudhsm/bin/cloudhsm_client /opt/cloudhsm/etc/cloudhsm_client.cfg &> /tmp/cloudhsm_client_start.log &
```

Using the `service` to start the client appears to cause this issue.