
//url 리퀘스트 동기처리
//GET
export function getAfetch (url: string): any{
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, false); // 동기(false) ,비동기(true)
  xhr.send();
  if (xhr.status == 200) { //GET 요청에 대해 성공적인경우
      try{
        return JSON.parse(xhr.responseText); // 서버로부터 받은 데이터를 출력
      }
      catch{
        return null;
      }
  }
  else{
      return JSON.parse(xhr.responseText);
  }
}

export function deleteAfetch (url: string): boolean{
  const xhr = new XMLHttpRequest();
  xhr.open("DELETE", url, false); // 동기(false) ,비동기(true)
  //헤더 정보가 필요한 경우에만 추가
  xhr.send();
  if (xhr.status == 200) { //GET 요청에 대해 성공적인경우
      return true;
  }
  else{
      return false;
  }
}
//POST
export function postAfetch (url: string,data: object): any{
  //******* AJAX Sync POST 요청 *******
  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, false); // 동기(false) ,비동기(true)
  //POST 요청 시 일반적으로 Content-Type은 세팅
  xhr.setRequestHeader("Content-Type", "application/json");
  //POST 요청에 보낼 데이터 작성
  xhr.send(JSON.stringify(data)); //JSON 형태로 변환하여 서버에 전송
  if (xhr.status == 200){
      return JSON.parse(xhr.responseText);
  }
  else{
      return JSON.parse(xhr.responseText);
  }
}

//POST
export function postAfetchNoJson (url: string,data: object): any{
  //******* AJAX Sync POST 요청 *******
  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, false); // 동기(false) ,비동기(true)
  //POST 요청 시 일반적으로 Content-Type은 세팅
  xhr.setRequestHeader("Content-Type", "application/json");
  //POST 요청에 보낼 데이터 작성
  xhr.send(JSON.stringify(data)); //JSON 형태로 변환하여 서버에 전송
  if (xhr.status == 200){
      return xhr.responseText;
  }
  else{
      return xhr.responseText;
  }
}
//POST
export function out_postAfetch (url: string,data: object): any{
  //******* AJAX Sync POST 요청 *******
  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, false); // 동기(false) ,비동기(true)
  //POST 요청 시 일반적으로 Content-Type은 세팅
  xhr.setRequestHeader("Content-Type", "application/json");
  //POST 요청에 보낼 데이터 작성
  xhr.send(JSON.stringify(data)); //JSON 형태로 변환하여 서버에 전송
  if (xhr.status == 200){
      return JSON.parse(xhr.responseText);
  }
  else{
      return null;
  }
}

//PUT
export function putAfetch (url: string,data: object): any{
  //******* AJAX Sync PUT 요청 *******
  const xhr = new XMLHttpRequest();
  xhr.open("PUT", url, false); // 동기(false) ,비동기(true)
  //PUT 요청 시 일반적으로 Content-Type은 세팅
  xhr.setRequestHeader("Content-Type", "application/json");
  //PUT 요청에 보낼 데이터 작성
  xhr.send(JSON.stringify(data)); //JSON 형태로 변환하여 서버에 전송
  if (xhr.status == 200){
      return JSON.parse(xhr.responseText);
  }
  else{
      return JSON.parse(xhr.responseText);
  }
}

//PUT
export function patchAfetch (url: string,data: object): any{
  //******* AJAX Sync PUT 요청 *******
  const xhr = new XMLHttpRequest();
  xhr.open("PATCH", url, false); // 동기(false) ,비동기(true)
  //PUT 요청 시 일반적으로 Content-Type은 세팅
  xhr.setRequestHeader("Content-Type", "application/json");
  //PUT 요청에 보낼 데이터 작성
  xhr.send(JSON.stringify(data)); //JSON 형태로 변환하여 서버에 전송
  if (xhr.status == 200){
      return JSON.parse(xhr.responseText);
  }
  else{
      return JSON.parse(xhr.responseText);
  }
}

