import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { packet } = await req.json()
    console.log('Analyzing packet:', packet)

    // If event is suspicious or threat level is Zero-Day Attack, immediately return suspicious result
    if (packet.eventDescription === 'Suspicious Activity' || packet.threatLevel === 'Zero-Day Attack') {
      const result = {
        status: 'suspicious',
        confidence: 100,
        timestamp: new Date().toISOString()
      }
      console.log('Analysis result:', result)
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Otherwise proceed with regular analysis
    let suspiciousScore = 0
    let totalFactors = 0

    // Anomaly score has highest weight (0-1 range)
    if (packet.anomalyScore > 0.7) {
      suspiciousScore += 30
    } else if (packet.anomalyScore > 0.5) {
      suspiciousScore += 15
    }
    totalFactors += 30

    // Response time analysis (anything over 1000ms is suspicious)
    if (packet.responseTime > 1000) {
      suspiciousScore += 15
    } else if (packet.responseTime > 500) {
      suspiciousScore += 7
    }
    totalFactors += 15

    // Data transfer rate analysis (unusually high rates are suspicious)
    if (packet.dataTransferRate > 100) {
      suspiciousScore += 10
    } else if (packet.dataTransferRate > 50) {
      suspiciousScore += 5
    }
    totalFactors += 10

    // Error code analysis
    if (packet.errorCode !== 200) {
      suspiciousScore += 15
    }
    totalFactors += 15

    // Protocol analysis (UDP slightly more suspicious than TCP)
    if (packet.protocol === 'UDP') {
      suspiciousScore += 10
    } else {
      suspiciousScore += 5
    }
    totalFactors += 10

    // Calculate final confidence percentage
    const confidence = Math.round((suspiciousScore / totalFactors) * 100)
    
    // Determine status based on confidence threshold
    const status = confidence > 60 ? 'suspicious' : 'normal'

    const result = {
      status,
      confidence,
      timestamp: new Date().toISOString()
    }

    console.log('Analysis result:', result)

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in analyze-packet function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
