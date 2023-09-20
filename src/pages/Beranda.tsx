import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle } from "@ionic/react"
import { useEffect, useRef, useState } from "react"
import { getWeather } from '../utils/api'
import { searchOutline, time } from 'ionicons/icons'

import './Beranda.css'
import { isAxiosError } from "axios"

// COMPONENTS
import LoadingScreen from "../components/LoadingScreen"
import ErrorScreen from "../components/ErrorScreen"
import SearchBar from "../components/SearchBar"

const Beranda: React.FC = () => {

    // STATE
    const [cuaca, setCuaca] = useState<any>()

    // REF
    const ionHeaderElement = useRef<HTMLIonHeaderElement>(null)
    const ionContentElement = useRef<HTMLIonContentElement>(null)
    const selectBarContainer = useRef<HTMLDivElement>(null)

    // EFFECT
    useEffect(() => {
        getWeather('1.4900578','124.8408708').then((result) => {
            setCuaca(result)
        })
    }, [])

    useEffect(()=>{
        // ------------------- MENGUBAH LATAR BELAKANG BERDASARKAN JAM -------------------
        if(cuaca){
            const timezone = cuaca.timezone/3600
            const jamSekarang = (new Date().getUTCHours())+timezone
    
            if(jamSekarang >= 5 && jamSekarang < 15) setContentBackgroundImg('day.jpg')
            if(jamSekarang >= 15 && jamSekarang < 18) setContentBackgroundImg('afternoon.jpg')
            if((jamSekarang >= 18 && jamSekarang <= 23) || (jamSekarang >= 0 && jamSekarang < 5)) setContentBackgroundImg('night.jpg')
        }
        
    },[cuaca])

    const setContentBackgroundImg = (namaFile:string)=>{
        ionContentElement?.current?.style.setProperty('--background',`url('/images/${namaFile}') repeat center fixed`)
    }

    const handleScrollEvent = (e:any)=>{
        const headerHasBg = ionHeaderElement?.current?.classList.contains('bg-active')
        if(e.detail.scrollTop != 0 && !headerHasBg){
            ionHeaderElement?.current?.classList.add('bg-active')
        }
        if(e.detail.scrollTop == 0 && headerHasBg){
            ionHeaderElement?.current?.classList.remove('bg-active')
        }
    }

    const handleSearchClick = ()=>{
        selectBarContainer.current?.style.setProperty('display','flex')
    }

    // JIKA TIDAK ERROR
    if(cuaca && !(cuaca instanceof Error)) return (
        <>
            <IonHeader translucent={true} className="ion-no-border" ref={ionHeaderElement}>
                <IonToolbar className="ion-padding-horizontal">
                    <IonIcon slot="start" icon={searchOutline} className="searchBtn" color="light" onClick={handleSearchClick}></IonIcon>
                    <IonTitle className="ion-text-center" color={"light"}>{cuaca.name}</IonTitle>
                    <IonIcon slot="end" icon={searchOutline} className="searchBtnHidden"></IonIcon>
                </IonToolbar>
            </IonHeader>

            <IonContent scrollEvents={true} onIonScroll={handleScrollEvent} fullscreen={true} className="background-image" ref={ionContentElement}>
                <div className="main-info ion-text-center ion-padding">
                    <h1 className="ion-no-margin">{cuaca.main.temp.toFixed()}<span>°C</span></h1>
                    <div className="weather-info">
                        <div className="weather-main">
                            <img src={`https://openweathermap.org/img/wn/${cuaca.weather[0].icon}.png`} alt="weather logo" />
                            <span>{cuaca.weather[0].main}</span>
                        </div>
                        {/* <div className="weather-info-sep">-</div> */}
                        <div className="weather-desc">
                            <span className="ion-no-margin">{cuaca.weather[0].description}</span>
                        </div>
                    </div>
                </div>
                <div className="other-info ion-padding">
                    <IonCard>
                        <IonCardHeader>
                            <IonCardSubtitle>Kecepatan Angin</IonCardSubtitle>
                            <IonCardTitle>{(cuaca.wind.speed*3.6).toFixed(1)}km/h</IonCardTitle>
                        </IonCardHeader>
                    </IonCard>
                    <IonCard>
                        <IonCardHeader>
                            <IonCardSubtitle>Kelembaban</IonCardSubtitle>
                            <IonCardTitle>{cuaca.main.humidity}%</IonCardTitle>
                        </IonCardHeader>
                    </IonCard>
                    <IonCard>
                        <IonCardHeader>
                            <IonCardSubtitle>Kemungkinan Hujan</IonCardSubtitle>
                            <IonCardTitle>{cuaca.clouds.all}%</IonCardTitle>
                        </IonCardHeader>
                    </IonCard>
                    <IonCard>
                        <IonCardHeader>
                            <IonCardSubtitle>Tekanan</IonCardSubtitle>
                            <IonCardTitle>{cuaca.main.pressure}mbar</IonCardTitle>
                        </IonCardHeader>
                    </IonCard>
                </div>
                <div className="ion-margin"></div>
            </IonContent>

            <SearchBar selectBarContainer={selectBarContainer} setCuaca={setCuaca}></SearchBar>
        </>
    )

    // JIKA ERROR
    if(cuaca && cuaca instanceof Error){
        if(isAxiosError(cuaca) && cuaca.code == 'ERR_NETWORK') return <ErrorScreen main="NETWORK ERROR" desc="Gagal terhubung dengan data cuaca!"/>

        if(isAxiosError(cuaca) && cuaca.code == 'ERR_BAD_REQUEST' && cuaca.response?.status === 401) return <ErrorScreen main="ERROR UNAUTHORIZED" desc="Tidak memiliki izin untuk mengakses data OpenWeatherAPI"/>

        if(isAxiosError(cuaca)) return <ErrorScreen main={cuaca.code} desc={cuaca.message}/>

        return <ErrorScreen/>
    }

    // JIKA STATE cuaca masih kosong
    return <LoadingScreen/>
}

export default Beranda