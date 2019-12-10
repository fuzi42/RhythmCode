class Ajax {
    get(url) {
      return new Promise(async(resolve, reject) => {
    await  fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
       
      },
    })
          .then(res => res.json())
          .then(data => resolve(data))
          .catch(err => reject(err))
   
      })
    }
   
    // post方式
   post(url, data) {
      return new Promise(async(resolve, reject) => {
   await   fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-type': 'application/json',
              
            },
            body: JSON.stringify(data)
          })
          .then(res => res.json())
          .then(data => resolve(data))
          .catch(err => reject(err))
   
      })
    }
   
   
    //put 修改
    put(url, data) {
      return new Promise(async(resolve, reject) => {
     await   fetch(url, {
            method: 'PUT',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
          })
          .then(res => res.json())
          .then(data => resolve(data))
          .catch(err => reject(err))
   
      })
    }
   
    //delete
    delete(url, data) {
      return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'DELETE',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
          })
          .then(res => res.json())
          .then(data => resolve('数据删除成功!'))
          .catch(err => reject(err))
      })
    }
  }
  export default new Ajax();//ES6导出