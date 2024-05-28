import Lottie from "lottie-react";
import Loading from "../../../assets/loading.json";

export default function LoadingModal() {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
            }}
        >
            <Lottie
                animationData={Loading}
                loop={true}
                style={{ width: 100, height: 100 }}
            />
        </div>
    );
}
