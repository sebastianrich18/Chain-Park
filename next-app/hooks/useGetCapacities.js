import React, { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useProvider } from "@web3modal/react"
import ChainPark from '../../truffle/build/contracts/ChainPark.json'

export default function useGetCapacities() {
    const [loading, setLoading] = useState(true)
    const [currentCapacities, setCurrentCapacities] = useState([])
    const [maxCapacities, setMaxCapacities] = useState([])
    const { provider, isReady } = useProvider()


    useEffect(() => {
        console.log(isReady)
        console.log(provider)
        async function getCapacities() {
            if (isReady) {
                console.log("Loading Capacities")
                setLoading(true)
                console.log(provider)
                const contract = new ethers.Contract(
                    ChainPark.networks[5].address,
                    ChainPark.abi,
                    provider
                )
                console.log(contract)
                console.log("using contract at address: " + ChainPark.networks[5].address)
                const lotCount = 26
                const currentCapacities = []
                const maxCapacities = []
                for (let i = 0; i < lotCount; i++) {
                    const cur = await contract.lotCurrentCapacities(i)
                    const max = await contract.lotMaxCapacities(i)
                    // currentCapacities.push(cur.toNumber())
                    // maxCapacities.push(max.toNumber())
                    setCurrentCapacities(old => [...old, cur.toNumber()])
                    setMaxCapacities(old => [...old, max.toNumber()])
                }
                // setCurrentCapacities(currentCapacities)
                // setMaxCapacities(maxCapacities)
                setLoading(false)
                console.log("Capacities Loaded")
            }
        }
        getCapacities()
    }, [isReady])

    return [currentCapacities, maxCapacities, loading]
}