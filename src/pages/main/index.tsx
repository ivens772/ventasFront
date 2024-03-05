import { NextPage } from "next";
import { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";
import RedirectIfNotAuthenticated from "middleware/authentication";
import { HeaderPage } from "~/components/header";
import { ContentPage } from "./contentPage";
import { UserList } from "~/components/users/userList";
import { Spinner } from "@chakra-ui/react";

const MainPage: NextPage = () => { 
 
  return (
    <>
     <RedirectIfNotAuthenticated>
      <HeaderPage />
      <UserList />
      <ContentPage />
      </RedirectIfNotAuthenticated>
    </>
  );
};

export default MainPage;
