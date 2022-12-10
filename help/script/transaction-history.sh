#!/bin/bash

# address=0xf1199999751b1a3A74590adBf95401D19AB30014
address=0x229b8325bb9Ac04602898B7e8989998710235d5f

tsocks curl https://api.etherscan.io/api\?module\=account\&action\=txlist\&address\=${address}\&startblock\=0\&endblock\=99999999\&sort\=asc\&apikey\=TVR7IRD74SBT34QXIAHT8U4J9AK3CKF7P5
