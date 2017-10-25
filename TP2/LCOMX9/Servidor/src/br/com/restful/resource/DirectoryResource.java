package br.com.restful.resource;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;

import javax.ws.rs.GET;
import javax.ws.rs.OPTIONS;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.google.gson.Gson;
import br.com.restful.controller.DirectoryController;
import br.com.restful.model.Diretorio;

@Path("/Directory")
public class DirectoryResource {

	@GET
	@Path("/GetFiles/{path:.*}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response GetFiles(@PathParam("path") String path) {
		
		Diretorio dir = new DirectoryController().diretorio(path);
		
		Gson gson = new Gson();
		String json = gson.toJson(dir);
		
		Response ret = Response.status(200).header("Access-Control-Allow-Origin", "*").entity(json).build();
		return ret;
	}
	
	
	@OPTIONS
	@Path("/GetFiles/{path:.*}")
 	public Response getOptions() {
		return Response.ok()
					   .header("Access-Control-Allow-Origin", "*")
					   .header("Access-Control-Allow-Methods", "POST, GET, PUT, UPDATE, OPTIONS")
					   .header("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-With").build();
	}
}
