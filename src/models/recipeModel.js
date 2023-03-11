const Pool = require("../config/db");

const insertData = (data) => {
  let { ingredients, title, photo, users_id, category_id } = data;
  let time = new Date().toISOString();
  return Pool.query(
    `INSERT INTO recipes(title,ingredients,photo,users_id,created_at, category_id) 
  VALUES('${title}','${ingredients}','${photo}','${users_id}','${time}', '${category_id}')`);
};

const getDataByName = (data) => {
  let {searchBy,search,sortBy,sort, limit, offset} = data
  return Pool.query(
    `SELECT recipes.id,recipes.title,recipes.ingredients,recipes.photo,recipes.users_id,users.email,recipes.created_at as posttime, category.name as category 
    FROM recipes JOIN category ON recipes.category_id=category.id 
    JOIN users ON recipes.users_id=users.id 
    WHERE recipes.${searchBy} ILIKE '%${search}%' 
    AND recipes.deleted_at IS NULL ORDER BY recipes.${sortBy} ${sort} LIMIT ${limit} OFFSET ${offset}`
  );
}

const selectDataById = (data) => {
  return Pool.query(
    `SELECT
    recipes.id, 
    recipes.title,
    recipes.ingredients,
    recipes.created_at as posttime, 
    category.name as category,
    users.name as creator,
    recipes.photo,
    recipes.users_id,
    recipes.category_id
  FROM 
    recipes 
  JOIN 
    category ON recipes.category_id=category.id
  JOIN 
    users ON users.id = users_id
  WHERE 
    recipes.id = ${data}` 
  )
} 

const selectData= (data) => {
  let {searchBy,search,sortBy,sort, limit, offset,id} = data
  return Pool.query(
    `SELECT recipes.id,recipes.title,recipes.ingredients,recipes.photo,recipes.users_id,users.email,recipes.created_at as posttime, category.name as category 
    FROM recipes JOIN category ON recipes.category_id=category.id 
    JOIN users ON recipes.users_id=users.id 
    WHERE recipes.${searchBy} ILIKE '%${search}%' 
    AND recipes.deleted_at IS NULL 
    AND recipes.users_id='${id}'
    ORDER BY recipes.${sortBy} ${sort} LIMIT ${limit} OFFSET ${offset}`
  )
};

const deleteRecipe = (id) => {
  let time = new Date().toISOString();
  return Pool.query(
    `UPDATE recipes SET deleted_at='${time}' WHERE id='${id}'`
    );
};


const updateData = (id, data) => {
  let { ingredients, title, photo, users_id, category_id} = data;
  return Pool.query(`UPDATE recipes SET ingredients='${ingredients}', title='${title}', photo='${photo}', category_id=${category_id}, users_id='${users_id}' WHERE id='${id}'`);
}

const findUser = (email) => {
  return new Promise((resolve,reject)=>
  Pool.query(`SELECT * FROM users WHERE id='${email}'`,
  (err,result)=>{
    if(!err){
      resolve(result)
    } else {
      reject(err)
    }
  }))
}





module.exports = { insertData, selectData, deleteRecipe, selectDataById, updateData, getDataByName, findUser };
