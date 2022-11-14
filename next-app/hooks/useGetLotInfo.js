import React, { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useProvider } from "@web3modal/react"
import ChainPark from '../../truffle/build/contracts/ChainPark.json'

export default function useGetLotInfo() {

    const NUM_LOTS = 26

    const [loading, setLoading] = useState(true)
    const [currentCapacities, setCurrentCapacities] = useState([9999, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    const [maxCapacities, setMaxCapacities] = useState([9999, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    const [lotFees, setLotFees] = useState([9999, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    const { provider, isReady } = useProvider()

    useEffect(() => {
        // console.log(isReady)
        // console.log(provider)
        async function getCapacities() {
            if (isReady && currentCapacities.length <= NUM_LOTS) {
                console.log("Loading Capacities")
                setLoading(true)
                // console.log(provider)
                const contract = new ethers.Contract(
                    ChainPark.networks[5].address,
                    ChainPark.abi,
                    provider
                )
                // console.log(contract)
                console.log("using contract at address: " + ChainPark.networks[5].address)
                for (let i = 1; i <= NUM_LOTS; i++) {
                    // contract.lotCurrentCapacities(i).then((cur) => {
                    //     let newCurrentCapacities = currentCapacities
                    //     newCurrentCapacities[i] = cur.toNumber()
                    //     setCurrentCapacities(newCurrentCapacities)
                    // })

                    // contract.lotMaxCapacities(i).then((max) => {
                    //     let newMaxCapacities = maxCapacities
                    //     newMaxCapacities[i] = max.toNumber()
                    //     setMaxCapacities(newMaxCapacities)
                    // })

                    // contract.getFee(i).then((fee) => {
                    //     let newLotFees = lotFees
                    //     newLotFees[i] = fee.toBigInt()
                    //     setLotFees(newLotFees)
                    // })
                    
                    let cur = await contract.lotCurrentCapacities(i)
                    let newCurrentCapacities = currentCapacities
                    newCurrentCapacities[i] = cur.toNumber()
                    setCurrentCapacities(newCurrentCapacities)

                    let max = await contract.lotMaxCapacities(i)
                    let newMaxCapacities = maxCapacities
                    newMaxCapacities[i] = max.toNumber()
                    setMaxCapacities(newMaxCapacities)

                    let fee = await contract.getFee(i)
                    let newLotFees = lotFees
                    newLotFees[i] = fee.toBigInt()
                    setLotFees(newLotFees)
                }
                // setCurrentCapacities(currentCapacities)
                // setMaxCapacities(maxCapacities)
                setLoading(false)
            }
        }
        getCapacities()
    }, [isReady])

    return [currentCapacities, maxCapacities, lotFees, loading]
}