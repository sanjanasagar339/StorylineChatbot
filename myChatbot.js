// Function to check if a script is already included
function scriptExists(url) {
    return document.querySelector(`script[src="${url}"]`) !== null;
  }
  
  // Function to load an external script if it's not already present
  function includeScript(url) {
    if (!scriptExists(url)) {
      const scriptTag = document.createElement("script");
      scriptTag.src = url;
      scriptTag.async = true;
      document.head.appendChild(scriptTag);
    }
  }
  
  // Function to send user messages to OpenAI API
  function SendMessage() {
    var player = GetPlayer();
    var message = player.GetVar("message");
    var chatHistory = player.GetVar("chatHistory");
    var role = player.GetVar("role");
    var apiKey = player.GetVar("apiKey");
  
    var systemContent = `Act as a ${role} Assistant. Provide concise responses within 500 characters.`;
    var userContent = `User: ${message}`;
  
    apiKey = `Bearer ${apiKey}`;
  
    function sendMessage() {
      player.SetVar("response", "Please wait...");
      player.SetVar("message", "");
  
      var xhr = new XMLHttpRequest();
      var url = "https://api.openai.com/v1/chat/completions";
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Authorization", apiKey);
  
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            var apiResponse = JSON.parse(xhr.responseText);
            if (
              apiResponse.choices &&
              apiResponse.choices[0] &&
              apiResponse.choices[0].message &&
              apiResponse.choices[0].message.content
            ) {
              var generatedResponse = apiResponse.choices[0].message.content.trim();
              player.SetVar("response", generatedResponse);
              player.SetVar(
                "chatHistory",
                `${chatHistory}\nUser: ${message}\nResponse: ${generatedResponse}\n`
              );
            } else {
              player.SetVar("response", `Error: ${JSON.stringify(apiResponse)}`);
            }
          } else {
            player.SetVar("response", `Error: ${xhr.status} - ${xhr.statusText}`);
          }
        }
      };
  
      var data = JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemContent },
          { role: "user", content: userContent },
        ],
      });
  
      xhr.send(data);
    }
  
    sendMessage();
  }

  