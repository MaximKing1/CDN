module.exports = async function (domain) {
   return {
      status: this.serverStatus,
      load: this.systemLoad
   }
}
