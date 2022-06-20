export type ErrorType = {
  statusCode: number,
  message: string,
}

const DefaultError: ErrorType = {
  statusCode: -1,
  message: 'Une erreur est survenue !'
}

const UnauthorizedError: ErrorType = {
  statusCode: 401,
  message: "Vous devez être connecter pour effectuer cette acton !"
}

const ForbiddenError: ErrorType = {
  statusCode: 403,
  message: "Vous n'avez pas les droits de faire cette action !"
};

const NotFoundError: ErrorType = {
  statusCode: 404,
  message: "Ressource non trouvé !"
}

const LoginError: ErrorType[] = [{
  message: "Email ou mot de passe non valide !",
  statusCode: 401,
}, ForbiddenError, NotFoundError]

export default class ErrorManager {

  public static LoginError(statusCode: number): ErrorType {
    return LoginError.find((err) => err.statusCode === statusCode) ?? DefaultError;
  }

/*  public static RegisterError(statusCode: number): ErrorType {

  }*/
}
