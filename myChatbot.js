function SendMessage() {
    var player = GetPlayer();
    var message = player.GetVar("message");  // User's input
    var role = player.GetVar("role");
    var apiKey = player.GetVar("apiKey");
  
    console.log("User Input:", message);  // ✅ Check what the user typed
  
    var systemContent = `You are an intelligent AI assistant. The user can ask you questions on any topic, including but not limited to mathematics, history, physics, geography, economics, artificial intelligence, and finance. Always provide relevant and accurate answers based on the user's question. If the user greets you, respond appropriately (e.g., if they say "hi," say "hello"). If they ask a mathematical question, calculate and provide the correct answer. Always ensure your response is relevant to the query asked.`;
    var userContent = message;
  
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
          console.log("API Response:", xhr.responseText); // ✅ Log API response
          
          if (xhr.status === 200) {
            var apiResponse = JSON.parse(xhr.responseText);
            
            if (apiResponse.choices && apiResponse.choices[0] && apiResponse.choices[0].message && apiResponse.choices[0].message.content) {
              var generatedResponse = apiResponse.choices[0].message.content.trim();
              console.log("Generated Response:", generatedResponse); // ✅ Check AI's response
              
              player.SetVar("response", generatedResponse);
            } else {
              player.SetVar("response", `Error: Invalid API Response`);
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
          { role: "user", content: message } // Using raw user input
        ],
        temperature: 0.7 // Adjust creativity level if needed
      });
      console.log("API Request Data:", data); // ✅ Log API request data
  
      xhr.send(data);
    }
  
    sendMessage();
  }
  