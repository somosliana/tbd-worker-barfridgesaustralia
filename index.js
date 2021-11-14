/**
 * gatherResponse awaits and returns a response body as a string.
 * Use await gatherResponse(..) in an async function to get the response body
 * @param {Response} response
 */
 async function gatherResponse(response) {
  const { headers } = response
  const contentType = headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    return JSON.stringify(await response.json())
  }
  else if (contentType.includes("application/text")) {
    return response.text()
  }
  else if (contentType.includes("text/html")) {
    return response.text()
  }
  else {
    return response.text()
  }
}

async function handleRequest(request) {
  const { searchParams } = new URL(request.url)
  let id = searchParams.get('id')
  let postcode = searchParams.get('postcode')
  let quantity = searchParams.get('quantity')

  let myHeaders = new Headers();
  myHeaders.append("x-requested-with", "XMLHttpRequest");
  myHeaders.append("Cookie", "sid_customer_87b02=4g5febsp6e8556v8coc0fct7ge");

  let formdata = new FormData();
  formdata.append("product_id", id);
  formdata.append("postcode", postcode);
  formdata.append(`product_data[${id}][amount]`, quantity);
  formdata.append("dispatch", "products.shipping_estimation");

  let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow'
  };
  const url = "https://www.bar-fridges-australia.com.au/index.php"
  const response = await fetch(url, requestOptions)
  const json = await response.json()
  const shipping_rate = json["shipping_rate"]
  const results = JSON.stringify({ shipping_rate })
  return new Response(results, requestOptions)
}

addEventListener("fetch", event => {
  return event.respondWith(handleRequest(event.request))
})
