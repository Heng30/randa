import { reactive } from 'vue';

export const navmenu = reactive({
    selectedPage: "ethAddrGen",
    ethAddrGen: true,
    ethAddrBalance: false,
    ethSetting: false,
    about: false,
})

export const ethNetwork = reactive([
    {
        name: "Ethereum 主网",
        network: "ethereum",
    },
    {
        name: "Goerli 测试网络",
        network: "2",
    },
    {
        name: "Sepolia 测试网络",
        network: "3",
    }
])
