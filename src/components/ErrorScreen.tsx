import styles from './ErrorScreen.module.css'

const ErrorScreen:React.FC<{main?:string,desc?:string}> = ({main,desc})=>{
    return (
        <div className={`${styles.container}`}>
            <div className={`${styles.wrapper}`}>
                <h4 className={`${styles.main}`}>{main ? main : 'ERROR'}</h4>
                <p className={`${styles.desc}`}>{desc ? desc : 'Terjadi error namun penyebabnya tidak diketahui'}</p>
            </div>
        </div>
    )
}

export default ErrorScreen