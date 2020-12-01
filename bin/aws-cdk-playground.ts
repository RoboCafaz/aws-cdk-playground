#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AwsCdkPlaygroundStack } from '../src/aws-cdk-playground-stack';

const app = new cdk.App();
new AwsCdkPlaygroundStack(app, 'AwsCdkPlaygroundStack');
