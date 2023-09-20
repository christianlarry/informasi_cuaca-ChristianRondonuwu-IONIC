import styles from './LoadingScreen.module.css'

const LoadingScreen:React.FC = ()=>{
    return (
        <div className={`${styles.container}`}>
            <span className={`${styles.loadingText}`}>Loading...</span>
        </div>
    )
}

export default LoadingScreen