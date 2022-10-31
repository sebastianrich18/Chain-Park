import React, { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useProvider } from "@web3modal/react"
import ChainPark from '../../truffle/build/contracts/ChainPark.json'

export default function useGetLotInfo() {

    const NUM_LOTS = 26

    const [loading, setLoading] = useState(true)
    const [currentCapacities, setCurrentCapacities] = useState([9999])
    const [maxCapacities, setMaxCapacities] = useState([9999])
    const [lotFees, setLotFees] = useState([9999])
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
                    contract.lotCurrentCapacities(i).then((cur) => {
                        setCurrentCapacities(old => [...old, cur.toNumber()]) // Pretty sure this doesn't guarantee index order
                    })

                    contract.lotMaxCapacities(i).then((max) => {
                        setMaxCapacities(old => [...old, max.toNumber()])
                    })

                    contract.getFee(i).then((fee) => {
                        setLotFees(old => [...old, fee.toNumber()])
                    })
                }
                // setCurrentCapacities(currentCapacities)
                // setMaxCapacities(maxCapacities)
                setLoading(false)
            }
        }
        getCapacities()
    }, [isReady])

    return [currentCapacities, maxCapacities, lotFees]
}