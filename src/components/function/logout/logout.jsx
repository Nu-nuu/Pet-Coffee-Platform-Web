import { signOut } from "firebase/auth";
import { auth } from "../../../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";

export function LogoutButton() {
    const navigate = useNavigate();

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                localStorage.clear();
                navigate("/");
            })
            .catch((error) => {
                console.log({ error });
            });
    };

    return (
        <div className="logoutButton">
            <div className="logout flex-center" onClick={handleSignOut}>
                <LogoutIcon fontSize="medium" />
                Đăng xuất
            </div>
        </div>
    );
}
