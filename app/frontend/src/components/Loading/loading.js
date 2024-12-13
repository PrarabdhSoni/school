const  Loading = () => {
    return(
        <div>
            <div class="loader">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
            <style jsx>{`
                .loader {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                }
                .dot {
                    width: 15px;
                    height: 15px;
                    margin: 0 5px;
                    background-color: #8c52ff;
                    border-radius: 50%;
                    animation: bounce 0.6s infinite alternate;
                }
                .dot:nth-child(2) {
                    animation-delay: 0.2s;
                    background-color: #FFCC00;
                }
                .dot:nth-child(3) {
                    animation-delay: 0.4s;
                }
                .dot:nth-child(4) {
                    animation-delay: 0.2s;
                    background-color: #FFCC00;
                }
                @keyframes bounce {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-20px); }
                }
            `}</style>
        </div>
    )
}

export default Loading;