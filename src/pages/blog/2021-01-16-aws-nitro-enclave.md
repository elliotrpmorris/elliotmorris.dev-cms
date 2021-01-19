---
templateKey: blog-post
title: AWS - Nitro Enclaves whats popping?
date: 2021-01-16T16:26:47.611Z
description: What is Nitro and why you should care about their enclaves.
featuredpost: true
featuredimage: /img/nitro-enclave.png
tags:
  - aws
---

## Introduction to Nitro

### AWS Nitro System

In short [AWS Nitro](https://aws.amazon.com/ec2/nitro/) is the underlying platform for the next generation of EC2 instances.

With claims of having:

- Faster innovation
- Enhanced security
- Better performance and price

This is great for us engineers when working with EC2 as who does love to innovate fast with high security and performance and cost in mind!

Enough about Nitro here's how Nitro Enclaves come to play. ⬇️

![enclave diagram](/img/nitro-enclave.png)

**Source**: <https://aws.amazon.com/ec2/nitro/nitro-enclaves/>

### Use case overview

Recently I have been working with the public sector firm who requires maximum security as you can imagine. Enclaves are great fit for this project as they allow you to create an isolated VM (Virtual machine) that has its own Kernel, CPU, and memory.

You can only talk to said enclave using a local channel in thte form of a [vSocket](https://vdc-repo.vmware.com/vmwb-repository/dcr-public/c509579b-fc98-4ec2-bf0c-cadaebc51017/f572d815-0e80-4448-a354-dff39a1d545e/doc/vsockAbout.3.2.html). Meaning if an attacker managed to get on to the host machine they wouldn't be able to touch the enclave.

### Key benefits of an enclave

- Cryptographic attestation
- Flexible
- Additional isolation and security

Enclaves are great for processing sensitive data and can integrate with AWS KMS allows you to use attestation to verify the enclaves identity meaning the key in KMS can only be used by a verified enclave.

## Example Implementation

### Implementation overview

In this example it will show you how to set up an enclave and how to talk to it via the ec2 host using a client server model. The client will connect to the server running in the enclave by using the enclaves `CID` once connected it will send `hi from client` as a message into the enclave which will then be returned back to the client as `HI FROM CLIENT`.

### Server / Enclave setup guide

You first need to create a ec2 instance that has enclaves enabled under configure instance you can tick to enable on nitro supported instance types.

![ec2 enclave](/img/ec2-enclave.PNG)

Next setup the `nitro-cli` using this guide [here](https://docs.aws.amazon.com/enclaves/latest/user/nitro-enclave-cli-install.html).

**Note:** A enclave image is just a docker image which is converted into a `.eif` file using the `nitro-cli`

For this example application I am using python so we are using the `python:3.9.1-slim` base image. Here is the full Dockerfile:

```
FROM python:3.9.1-slim

WORKDIR /app

COPY server.py ./
COPY run.sh ./

RUN chmod +x run.sh

CMD ["/app/run.sh"]
```

The `run.sh` is just a script to run the python app:

```
#!/bin/sh

# Run the app
python3 /app/server.py
```

The server code for this is super simple to setup as python supports vSockets natively from python 3.7:

```
import socket
import datetime

def server():
    print('Hello from enclave server!')

    port = 5000

    s = socket.socket(socket.AF_VSOCK, socket.SOCK_STREAM)

    cid = socket.VMADDR_CID_ANY

    s.bind((cid, port))

    s.listen()

    client_socket, address = s.accept()
    print("Connection from: " + str(address))
    while True:
        data = client_socket.recv(1024).decode('utf-8')
        if not data:
            break
        print('From online user: ' + data + ' | At: ' + str(datetime.datetime.now()))

        # Send msg back to client but uppercase.
        data = data.upper()
        client_socket.send(data.encode('utf-8'))
    client_socket.close()


if __name__ == '__main__':
    server()
```

Now you have these on the ec2 to build the enclave you use:

```
sudo nitro-cli build-enclave --docker-path . --output-file server.eif
```

To run the built enclave image use:

```
sudo nitro-cli run-enclave --cpu-count 2 --memory 512 --eif-path server.eif --debug-mode
```

To view the read only console of the enclave use:

```
ENCLAVE_ID=$(nitro-cli describe-enclaves | jq -r .[0].EnclaveID)

nitro-cli console --enclave-id $ENCLAVE_ID
```

### Client setup guide

This client code wants to run on the ec2 host, for this open a new SSH connection to your ec2 so you can see both the enclave server and client outputs easily.

```
import socket
import time
import sys

def client():

    port = 5000

    connected = False
    s = socket.socket(socket.AF_VSOCK, socket.SOCK_STREAM)

    cid = int(sys.argv[1])

    message = 'hi from client'
    while not connected:
        try:
            s.connect((cid, port))
            connected = True

            print('Connected to server... ')

            # send msg via socket
            s.send(message.encode('utf-8'))

            # get back msg from server
            data = s.recv(1024).decode('utf-8')

            print('Received from server: ' + data)

        except ConnectionError:
            print('Server not available yet, trying again in 2 seconds...')
            time.sleep(2)


if __name__ == '__main__':
    client()
```

Make sure to make a note of the CID when the enclave is created or if you didn't you can store it in a environment variable using:

```
CID=$(nitro-cli describe-enclaves | jq -r .[0].EnclaveCID)

python3 /app/client.py $CID
```

Now you will be able to see the output from both the enclave and ec2 host you have successfully talked to the enclave over vSocket. Let your imagination take you to the next level on what you can do with this!

## Conclusion

I only scratched the surface here at what enclaves are capable of but with this simple example you can see how great they are for sensitive data processing.