import jwt
from graphql_jwt.utils import jwt_decode, refresh_has_expired, get_credentials, get_http_authorization
from graphql_jwt.settings import jwt_settings
from graphql_jwt.mixins import VerifyMixin

def refreshTokenMiddleWare(get_response):
    # this middleware functionality is check the validity of the 
    # token and if the access token is expired then the access token
    # is refreshed and set the appropriate headers

    def middleware(request):
        # implement the logic

        # get token and refresh token
        AUTH_HEADER = request.headers.get('authorization')
        refreshToken = request.headers.get('X-Refresh-Token')
        token = get_http_authorization(request)

        # check if the tokens are valid
        try:
            payload = jwt_settings.JWT_DECODE_HANDLER(token)
        except jwt.ExpiredSignature: 
            pass
            
        except jwt.DecodeError:
            raise exceptions.JSONWebTokenError(_('Error decoding signature'))
        except jwt.InvalidTokenError:
            raise exceptions.JSONWebTokenError(_('Invalid token')) 
        # check if token is expired

            # refresh token
            # add appropriate headers
        
        response = get_response(request)
        return response
    return middleware