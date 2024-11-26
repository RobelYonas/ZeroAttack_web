import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

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
    console.log('Starting model upload process')
    const formData = await req.formData()
    const modelFile = formData.get('model')
    const name = formData.get('name')

    if (!modelFile || !name) {
      console.error('Missing required fields')
      return new Response(
        JSON.stringify({ error: 'Model file and name are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log('Initializing Supabase client')
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Generate unique file path
    const filePath = `${crypto.randomUUID()}-${modelFile.name}`
    console.log('Generated file path:', filePath)

    // Upload to storage
    console.log('Uploading file to storage')
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('models')
      .upload(filePath, modelFile, {
        contentType: modelFile.type,
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return new Response(
        JSON.stringify({ error: 'Failed to upload model file', details: uploadError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Create database entry
    console.log('Creating database entry')
    const { error: dbError } = await supabase
      .from('models')
      .insert({
        name: name,
        original_file_path: filePath,
        status: 'uploaded'
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Failed to create database entry', details: dbError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    console.log('Upload process completed successfully')
    return new Response(
      JSON.stringify({ 
        message: 'Model uploaded successfully',
        filePath 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})