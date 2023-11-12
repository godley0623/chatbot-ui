import { usePopupState } from "./PopupContext"

const Popup = ( ) => {
    const { popupValue, updatePopupValue } = usePopupState()
    const icon = popupValue.icon
    const text = popupValue.text
    
    const handleClick = () => {
        updatePopupValue({hidden: true, icon: "", text: ""})
    }

    return (
        <div className="z-50 absolute w-screen h-screen bg-black/50 flex justify-center items-center">
            <div className="w-1/2 h-1/2 bg-white flex flex-col justify-around items-center">
                {icon !== "" && <div className="w-1/6 h-1/6"><img className="w-full h-auto" src={icon} alt="popup icon" /></div>}

                <p className="text-black">{"Please use a modern browser with the getalby.com extension installed"}</p>
                <button onClick={handleClick} className="bg-black">Ok Doggie</button>
            </div>
        </div>
    )
}

export default Popup