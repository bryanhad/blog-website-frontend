import { isServer } from '@/utils/utils'
import { useCallback, useEffect, useState } from 'react'

/**
 * A hook that automatically saves a value to sessionStorage at a specified interval 
 */
export default function useAutoSave<T>(key: string, value: T, interval = 3000) {
    //the key is what we will use to indentify what is it that we store in the session storage
    const stringifiedValue = JSON.stringify(value)

    const [lastSavedValue, setLastSavedValue] = useState(() => {
        //whatever we retrun from this arrow func, will be used as the intial state
        if (isServer()) return null //even though the useState is a client component, it is STILL prerendered on the server!
        // so if we want to set the initial state to the sessionStorage.. which is a browserAPI, it has to be on the client!
        
        // so the initialState of this state would be null when it is prerendered on the server, and would change when it is mounted on the client..
        return sessionStorage.getItem(key)
    })

    const [autoSave, setAutoSave] = useState(false)

    useEffect(() => {
        const i = setInterval(() => {
            setAutoSave(true)
        }, interval)

        //whenever we use somekind of interval or a listener in a useEffect, we have to clean up afterwards..
        // so whenever this hook that has a useEffect is called.. how many time it is.. the behaviour would still be the same
        return () => {
            setAutoSave(false)
            clearInterval(i)
        }
    }, [interval])

    //we need to split up the autosave operartion into 2 useEffect,
    // cuz if we do it in one useEffect, when we want to use the stringifiedValue,
    // our useEffect would run wheneever the stringifiedValue changes! which is everytime the user types..
    // which would defeat our purpose of using interval that will do the autosave whenever the interval time has passed,
    // AND also when the current user's field is different than the last saved value on the sesison storage..

    useEffect(() => {
        if (autoSave && stringifiedValue !== lastSavedValue) {
            sessionStorage.setItem(key, stringifiedValue)

            setAutoSave(false) // set the autosave to false, where it will be true again after 3 seconds has passed
            setLastSavedValue(stringifiedValue) // set the last saved value to the new string
        }
    }, [autoSave, key, lastSavedValue, stringifiedValue])

    
    //these 2 function below would be recreated whenever this useAutoSave func has a different value..

    const getValue = useCallback((): T | null => {
        const savedValue = sessionStorage.getItem(key)
        return savedValue ? JSON.parse(savedValue) : null
    }, [key]) //only when the key changes, this func would be declared again..

    const clearValue = useCallback(() => { //this is jsut to makes it easier for us, cuz we only need to pass in the key 1 time when we call the hook.. and our clearValue function would clear the correct session item..
        sessionStorage.removeItem(key)
    }, [key])

    return { getValue, clearValue }
}
