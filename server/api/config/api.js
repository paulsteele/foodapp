API = {
  authentication: function( apiKey ) {},
  connection: function( request ) {
    var getRequestContents = API.utility.getRequestContents(request);
    //do key checking here
    return {data: getRequestContents};
  },
  handleRequest: function( context, resource, method ) {
    var connection = API.connection(context.request);
    if (!connection.error){
      API.methods[resource][method](context, connection);
    }
    else{
      API.utility.response(context, 401, connection);
    }
  },
  methods: {
    echo: {
      GET: function( context, connection ) {
        API.utility.response(context, 200, "hello");
      },
      POST: function( context, connection ) {},
      PUT: function( context, connection ) {},
      DELETE: function( context, connection ) {}
    }
  },
  resources: {},
  utility: {
    getRequestContents: function( request ) {
      switch(request.method){
        case "GET":
          return request.query;
        case "POST":
        case "PUT":
        case "DELETE":
          return request.body;
      }
    },
    hasData: function( data ) {},
    response: function( context, statusCode, data ) {
      context.response.setHeader('Content-Type', 'application/json');
      context.response.statusCode = statusCode;
      context.response.end(JSON.stringify(data));
    },
    validate: function( data, pattern ) {}
  }
};