// Página [userId].tsx

import RedirectIfNotAuthenticated from "middleware/authentication";
import { useRouter } from "next/router";
import { InitialFocus } from "~/components/users/createUser";

const EditUser = () => {
  const router = useRouter();

  return (
    <RedirectIfNotAuthenticated>   
     <div>
      <h1>Detalles del Usuario</h1>
     <InitialFocus userId={router.query.userId as string}/>
      {/* Agrega aquí más contenido según sea necesario */}
    </div>
    </RedirectIfNotAuthenticated>

  );
};

export default EditUser;

