---
templateKey: blog-post
title: AWS - Nitro Enclaves whats popping?
date: 2021-01-16T16:26:47.611Z
description: What is Nitro and why you should care about their enclaves
featuredpost: true
featuredimage: /img/product-page-diargam_nitro-enclaves_enclaves-2x.92bb883b919db62d2659339601fd9725eebb4351.png
tags:
  - aws
---

### AWS Nitro System
In short [AWS Nitro](https://aws.amazon.com/ec2/nitro/) is the underlying platform for the next generation of EC2 instances.

With claims of having:
- Faster innovation
- Enhanced security 
- Better performance and price

This is great for us engineers when working with EC2 as who does love to innovate fast with high security and performance and cost in mind!

Enough about Nitro here's is how Nitro Enclaves come to play. ⬇️

![enclave diagram](/img/product-page-diargam_nitro-enclaves_enclaves-2x.92bb883b919db62d2659339601fd9725eebb4351.png)

**Source**: <https://aws.amazon.com/ec2/nitro/nitro-enclaves/>

### Use case overview

Recently I have been working with the public sector firm who requires maximum security as you can imagine. Enclaves are great fit for this project as they allow you to create an isolated VM (Virtual machine) that has its own Kernel, CPU, and memory. 

You can only talk to said enclave using a local channel in hte form of a [vSocket](https://vdc-repo.vmware.com/vmwb-repository/dcr-public/c509579b-fc98-4ec2-bf0c-cadaebc51017/f572d815-0e80-4448-a354-dff39a1d545e/doc/vsockAbout.3.2.html). Meaning if an attacker managed to get on to the host machine they wouldn't be able to touch the enclave. 

### Key benefits of an enclave

- Cryptographic attestation
- Flexible
- Additional isolation and security

Enclaves are great for processing sensitive data and can integrate with AWS KMS allows you to use attestation to verify the enclaves identity meaning the key in KMS can only be used by a verified enclave.
