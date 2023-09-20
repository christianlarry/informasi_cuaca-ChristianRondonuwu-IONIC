import { useRef, useState } from 'react'
import './SearchBar.css'
import Select from 'react-select'

import {getCoordinatesByCity} from '../utils/api'
import { IonIcon } from '@ionic/react'
import {closeCircleOutline} from 'ionicons/icons'

import {getWeather} from '../utils/api'

const SearchBar:React.FC<{selectBarContainer: React.RefObject<HTMLDivElement>, setCuaca: (cuaca: any) => void}> = ({selectBarContainer,setCuaca})=>{

    const [searchOptions,setSearchOptions] = useState([])

    const handleInputChange = (val:string)=>{
        if(val){
            getCoordinatesByCity(val).then((value)=>{
                const result = value.map((data:any)=>{
                    return {
                        label: `${data.name}, ${data.state} (${data.country})`,
                        value: {
                            lat: data.lat,
                            lon: data.lon
                        }
                    }
                })
                setSearchOptions(result)
            })
        }
    }

    const handleSelectChange = (val:any)=>{
        selectBarContainer.current?.style.setProperty('display','none')
        getWeather(String(val.value.lat),String(val.value.lon)).then((result)=>{
            setCuaca(result)
        })
    }

    const handleCloseClick = ()=>{
        selectBarContainer.current?.style?.setProperty('display','none')
    }

    return (
        <div className="select-bar-container" ref={selectBarContainer}>
            <Select placeholder='Cari Kota...' className='select-bar' options={searchOptions} onInputChange={handleInputChange} onChange={handleSelectChange}></Select>

            <IonIcon icon={closeCircleOutline} color='danger' size='large' className='ion-margin-top' onClick={handleCloseClick}></IonIcon>
        </div>
    )
}

export default SearchBar