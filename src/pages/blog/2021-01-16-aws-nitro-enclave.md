---
templateKey: blog-post
title: AWS - Nitro Enclave
date: 2021-01-16T16:26:47.611Z
description: What are they and why you should care about them
featuredpost: true
featuredimage: /img/product-page-diargam_nitro-enclaves_enclaves-2x.92bb883b919db62d2659339601fd9725eebb4351.png
tags:
  - aws
---

![enclave diagram](/img/product-page-diargam_nitro-enclaves_enclaves-2x.92bb883b919db62d2659339601fd9725eebb4351.png)

**Source**: <https://aws.amazon.com/ec2/nitro/nitro-enclaves/>

### Overview

Recently I have been working with the public sector and requires maximum security as you can imagine. This is where enclaves come in. They allow you to create an isolated VM (Virtual machine) that has its own Kernel, CPU, and memory. The key factor of why this so secure is the fact the only way you can talk to this VM is via a local channel in the form a of a [vSocket](https://vdc-repo.vmware.com/vmwb-repository/dcr-public/c509579b-fc98-4ec2-bf0c-cadaebc51017/f572d815-0e80-4448-a354-dff39a1d545e/doc/vsockAbout.3.2.html). Meaning if an attacker managed to get on to the host machine they wouldn't be able to see what the enclave was doing.

### Key benefits of an enclave

- Cryptographic attestation
- Flexible
- Additional isolation and security

Enclaves are great for processing sensitive data and can integrate with AWS KMS allows you to use attesation to verify the enclaves identity meaning the key in KMS can only be used by a verified enclave.

### How to use them

We can use the python base image to create the docker files for both the server and client.

```
FROM python:3.9.1-slim

WORKDIR /app

COPY client.py ./

COPY run.sh ./

RUN chmod +x run.sh

CMD ["/app/run.sh"]
```

### nitro-cli

- Install the CLI via [](https://docs.aws.amazon.com/enclaves/latest/user/nitro-enclave-cli-install.html)<https://docs.aws.amazon.com/enclaves/latest/user/nitro-enclave-cli-install.html>

- Build enclave: `sudo nitro-cli build-enclave --docker-uri elliotrpmorris/server-amazon:vsocket-python-base-slim --output-file server.eif`

- Run enclave: `sudo nitro-cli run-enclave --cpu-count 2 --memory 512 --eif-path server.eif --debug-mode`

- See the enlaves console: `sudo nitro-cli console --enclave-id <enclave_Id>`
