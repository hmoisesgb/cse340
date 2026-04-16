const pool = require('../database');

/* ***************************
 *  Get all favorite vehicles of a user
 * ************************** */
async function getFavoriteVehiclesByAccountId(account_id){
    try {
        const data = await pool.query(
            `SELECT i.* FROM public.favorites AS f
            JOIN public.inventory AS i
            ON f.inv_id = i.inv_id
            WHERE f.account_id = $1`,
            [account_id]
        )
        return data.rows
    } catch (error){
        console.log("getfavoritesbyid error: " + error)
        return error.message
    }
}

/* ***************************
 *  Insert into favorites
 * ************************** */
async function addToFavorites(account_id, inv_id){
    try{
        const sql = `INSERT INTO public.favorites (account_id, inv_id) VALUES ($1, $2) RETURNING *`
        return await pool.query(sql,[account_id, inv_id])
    } catch(error){
        console.log("addtofavorites error: " + error)
        return error.message
    }
}

/* ***************************
 *  Delete from favorites
 * ************************** */
async function deleteFromFavorites(account_id, inv_id){
    try {
        const sql = `DELETE FROM public.favorites WHERE account_id = $1 AND inv_id = $2 RETURNING *`
        return await pool.query(sql, [account_id, inv_id])
    } catch (error) {
        console.log("deletefromfavorites error: " + error)
        return error.message
    }
}

/* ***************************
 *  Check if favorite exists
 * ************************** */
async function checkFavorite(account_id, inv_id){
    try{
        const sql = `SELECT * from public.favorites WHERE account_id = $1 AND inv_id = $2`
        const data = await pool.query(sql, [account_id,inv_id])
        return data.rowCount > 0
    } catch(error){
        console.log("checkFavorite error: " + error)
        return false
    }
}

module.exports = { getFavoriteVehiclesByAccountId, addToFavorites, deleteFromFavorites, checkFavorite}