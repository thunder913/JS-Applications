function validate(request){
    let method = request.method;
    let uri = request.uri;
    let version = request.version;
    let message = request.message;
    
    let httpMethods = ['GET', 'POST', 'DELETE', 'CONNECT'];
    let httpVersions = ['HTTP/0.9', 'HTTP/1.0', 'HTTP/1.1', 'HTTP/2.0'];
    let uriRegex= /^[A-Za-z0-9..]*$/;
    let messageRegex = /^(?![<>\\&'"]).*$/;

    if (!httpMethods.includes(method)) {
        throw new Error(`Invalid request header: Invalid Method`);
    } else if(!uriRegex.test(uri)|| uri === ''){
        throw new Error(`Invalid request header: Invalid URI`);
    }else if(!httpVersions.includes(version)){
        throw new Error(`Invalid request header: Invalid Version`);
    }else if(!messageRegex.test(message)){
        throw new Error(`Invalid request header: Invalid Message`);
    }

    return request;
}