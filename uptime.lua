local function getAveragePing()
    local totalPing = 0
    local playerCount = 0

    for _, playerId in ipairs(GetPlayers()) do
        totalPing = totalPing + GetPlayerPing(playerId)
        playerCount = playerCount + 1
    end

    if playerCount > 0 then
        return totalPing / playerCount
    else
        return 0
    end
end

local function sendPing()
    local ping = getAveragePing()
    PerformHttpRequest('http://localhost:3000/ping', function(err, text, headers) 
        if err ~= 200 then
            print("Failed to send ping: " .. err)
        else
            print("Ping sent successfully: " .. text)
        end
    end, 'POST', json.encode({ ping = ping }), { ['Content-Type'] = 'application/json' })
end

-- Set up a timer to call sendPing every minute
Citizen.CreateThread(function()
    while true do
        sendPing()
        Citizen.Wait(60000) -- Wait for 60000 milliseconds (1 minute)
    end
end)
