import React, { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useProvider, useAccount } from "@web3modal/react"
import ChainPark from '../../truffle/build/contracts/ChainPark.json'

export default function useGetCurrentLot() {

    const NUM_LOTS = 26

    const { account } = useAccount();
    const [lotLoading, setLotLoading] = useState(true)
    const [currentLot, setCurrentLot] = useState(1)
    const { provider, isReady } = useProvider()


    useEffect(() => {
        async function getCurrentLot() {
            if (isReady && account.isConnected) {
                setLotLoading(true)
                const contract = new ethers.Contract(
                    ChainPark.networks[5].address,
                    ChainPark.abi,
                    provider
                )
                let lot = await contract.currentlyParked(account.address)
                setCurrentLot(lot.toNumber())
                setLotLoading(false)
            }
        }
        getCurrentLot()
    }, [currentLot])
    return [currentLot, setCurrentLot, lotLoading]
}