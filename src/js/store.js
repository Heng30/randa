import { reactive } from 'vue';

export const navmenu = reactive({
    selectedPage: "ethAddrGen",
    ethAddrGen: true,
    ethAddrBalance: false,
    ethSetting: false,
    about: false,
})

//  - "homestead"
//  - "rinkeby"
//  - "ropsten"
//  - "kovan"
//  - "goerli"
export const ethNetwork = reactive([
    {
        name: "Ethereum 主网",
        network: "homestead",
    },
    {
        name: "Rinkeby 测试网络",
        network: "rinkeby",
    },
    {
        name: "Ropsten 测试网络",
        network: "ropsten",
    },
    {
        name: "Kovan 测试网络",
        network: "kovan",
    },
    {
        name: "Goerli 测试网络",
        network: "goerli",
    },
])
