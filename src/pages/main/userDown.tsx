import RedirectIfNotAuthenticated from "middleware/authentication";
import { NextPage } from "next";
import { UserDownList } from "~/components/users/userDownList";



const UserDown:NextPage = ()=>{
    return <>
    <RedirectIfNotAuthenticated>
    <UserDownList />
    </RedirectIfNotAuthenticated>
    </>
}

export default UserDown