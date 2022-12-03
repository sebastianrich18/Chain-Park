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
        async function getCapacities() {
            if (isReady && currentCapacities.length <= NUM_LOTS) {
                console.log("Loading Capacities")
                setLoading(true)
                const contract = new ethers.Contract(
                    ChainPark.networks[5].address,
                    ChainPark.abi,
                    provider
                )
                console.log("using contract at address: " + ChainPark.networks[5].address)

                contract.getLotMaxCapacities().then((maxCapacities) => {
                    let asNum = maxCapacities.map((x) => x.toNumber())
                    setMaxCapacities(asNum)
                })
                contract.getLotCurrentCapacities().then((currentCapacities) => {
                    let asNum = currentCapacities.map((x) =>  x.toNumber())
                    setCurrentCapacities(asNum)
                })
                for (let i=0; i<NUM_LOTS; i++) {
                    let fee = await contract.getFee(i)
                    let asNum = fee.toBigInt()
                    setLotFees((lotFees) => {
                        let newLotFees = [...lotFees]
                        newLotFees[i] = asNum
                        return newLotFees
                    })
                }
                setLoading(false)
            }
        }
        getCapacities()
    }, [isReady])

    return [currentCapacities, maxCapacities, lotFees, setCurrentCapacities, loading]
}