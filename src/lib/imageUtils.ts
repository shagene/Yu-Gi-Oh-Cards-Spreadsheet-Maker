export async function checkImageAvailability(cardId: number): Promise<boolean> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/yugioh_spreadsheet_maker_cards/${cardId}.jpg`,
      { method: 'HEAD' }
    );
    return res.ok;
  } catch {
    return false;
  }
}
