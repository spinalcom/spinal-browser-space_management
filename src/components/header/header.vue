<template>
  <nav class="navbar navbar-light bg-light mainNavbar">
    <a class="navbar-brand"
       href="#">
      <img src="../../assets/logo_medium.png"
           width="180"
           height="50"
           id="spinalcomLogo"
           class="d-inline-block align-top"
           alt="spinalcom">
    </a>
  </nav>
</template>


<script>
export default {
  name: "Header"
};
</script>

<style scoped>
.mainNavbar {
  height: 64px;
  padding: 5px;
  border-bottom: black;
  border-style: solid;
  border-width: 0px 0px 1px 0px;
}
#spinalcomLogo {
  padding:4px;
  margin:4px 7px;
}
</style>

