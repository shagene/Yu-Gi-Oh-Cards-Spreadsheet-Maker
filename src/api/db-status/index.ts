import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    // Check if we can connect to Supabase and query the cards table
    const { count, error } = await supabase
      .from('cards')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return NextResponse.json({
        progress: 0,
        message: "Database connection failed",
        state: "error"
      });
    }

    // If we can connect and there are cards, database is ready
    if (count && count > 0) {
      return NextResponse.json({
        progress: 100,
        message: "Database ready",
        state: "ready"
      });
    }

    // If we can connect but no cards, database needs initialization
    return NextResponse.json({
      progress: 50,
      message: "Database connected but no cards found. Please run the migration script.",
      state: "initializing"
    });

  } catch (err) {
    return NextResponse.json({
      progress: 0,
      message: "Failed to check database status",
      state: "error"
    });
  }
}