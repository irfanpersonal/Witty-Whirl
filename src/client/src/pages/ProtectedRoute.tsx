import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";
import {type useSelectorType} from '../store';

interface ProtectedRouteProps {
    children: React.ReactNode
}

const ProtectedRoute: React.FunctionComponent<ProtectedRouteProps> = ({children}): any => {
    const {user} = useSelector((store: useSelectorType) => store.user);
    if (!user) {
        return <Navigate to='/landing'/>
    }
    return children;
}

export default ProtectedRoute;