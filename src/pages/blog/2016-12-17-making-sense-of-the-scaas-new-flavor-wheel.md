---
templateKey: blog-post
title: AWS - Nitro Enclaves
date: 2021-01-14T23:06:39.096Z
description: "What are they and why should you care about them! "
featuredpost: false
featuredimage: /img/product-page-diargam_nitro-enclaves_enclaves-2x.92bb883b919db62d2659339601fd9725eebb4351.png
tags:
  - aws
---
![enclave diagram](/img/product-page-diargam_nitro-enclaves_enclaves-2x.92bb883b919db62d2659339601fd9725eebb4351.png)

**Source**: <https://aws.amazon.com/ec2/nitro/nitro-enclaves/>

### Overview 
Recently i have been working with the public sector and requires maximum secruity as you can imagine. This is where enclaves come in. They allow you to create an isolated VM (Virtual machine) that has its own Kernel, CPU and memory. The key factor of why this so secure is the fact the only way you can talk to this VM is via a local channel in the form a of a [vSocket](https://vdc-repo.vmware.com/vmwb-repository/dcr-public/c509579b-fc98-4ec2-bf0c-cadaebc51017/f572d815-0e80-4448-a354-dff39a1d545e/doc/vsockAbout.3.2.html). Meaning if an attacker managed to get on to the host machine they wouldnt be able to see what the enclave was doing. 


### Key benefits of an enclave

* Cryptographic attestation
* Flexible
* Additional isolation and security

Enclaves are great for processing senestive data and can intergrate with AWS KMS allows you to use attestion to verify the enclaves identity meaning the key in KMS can only be used by a verifed enclave.

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