import { HttpHeaders } from "@angular/common/http";

export const httpOptions={
    headers: new HttpHeaders({
      'content-type' : 'application/json'
    })
  }