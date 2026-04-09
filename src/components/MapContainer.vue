<template>
  <div class="map-container">
    <div id="container"></div>
    <div class="location-info" v-if="locationInfo">
      <div class="info-title">位置信息</div>
      <div class="info-item"><span>地址：</span>{{ locationInfo.address }}</div>
      <div class="info-item" v-if="locationInfo.township">
        <span>乡镇：</span>{{ locationInfo.township }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, onUnmounted, ref, defineEmits } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";

let map = null;
let marker = null;
let geocoder = null;
let geolocation = null; // 声明定位实例
const locationInfo = ref(null);

// 定义事件
const emit = defineEmits(["updateLocation"]);

onMounted(() => {
  window._AMapSecurityConfig = {
    securityJsCode: "1c434b9a79750f38693cab31d2838b48",
  };
  AMapLoader.load({
    key: "2ef6aa98f87a75348ee9ab0f25d40570",
    version: "2.0",
    plugins: ["AMap.Scale", "AMap.Geolocation", "AMap.Geocoder"],
  })
    .then((AMap) => {
      map = new AMap.Map("container", {
        viewMode: "3D",
        zoom: 18,
        center: [113.69025115832676, 34.62589047189125], // 初始中心点
      });

      marker = new AMap.Marker({
        position: map.getCenter(),
        offset: new AMap.Pixel(-13, -30),
        anchor: "bottom-center",
        zIndex: 101,
      });

      map.add(marker);
      map.addControl(new AMap.Scale());

      geocoder = new AMap.Geocoder({ radius: 200, extensions: "all" });

      // 启动自动定位
      initGeolocation(AMap);

      // 监听地图拖动结束，更新位置信息
      map.on("moveend", () => {
        const center = map.getCenter();
        marker.setPosition(center);
        getLocationInfo(center);
      });
    })
    .catch((e) => console.log(e));
});

// **初始化高德定位**
const initGeolocation = (AMap) => {
  geolocation = new AMap.Geolocation({
    enableHighAccuracy: true, // 启用高精度
    timeout: 10000, // 超时时间
    showButton: false, // 不显示默认定位按钮
    showMarker: false, // 不显示默认标记
    showCircle: false, // 不显示精度范围
    convert: true, // 自动转换坐标系
  });

  // 获取当前位置信息
  geolocation.getCurrentPosition((status, result) => {
    if (status === "complete" && result.position) {
      map.setCenter(result.position);
      marker.setPosition(result.position);
      getLocationInfo(result.position);
    } else {
      console.log("定位失败", result.message);
    }
  });

  // **开启实时定位**
  geolocation.watchPosition((status, result) => {
    if (status === "complete" && result.position) {
      map.setCenter(result.position);
      marker.setPosition(result.position);
      getLocationInfo(result.position);
    }
  });
};

// **获取位置信息**
const getLocationInfo = (lnglat) => {
  if (!geocoder) return;

  geocoder.getAddress(lnglat, (status, result) => {
    if (status === "complete" && result.info === "OK") {
      const addressComponent = result.regeocode.addressComponent;
      const address = result.regeocode.formattedAddress;
      const pois = result.regeocode.pois;

      let nearestBuilding = "";
      if (pois && pois.length > 0) {
        const buildings = pois.filter((poi) =>
          ["建筑", "住宅", "商务写字楼", "公司企业"].some((type) =>
            poi.type.includes(type)
          )
        );

        nearestBuilding = buildings.length > 0 ? buildings[0].name : pois[0].name;
      }

      locationInfo.value = {
        address,
        building: nearestBuilding,
        neighborhood: addressComponent.neighborhood || "",
        businessArea: addressComponent.businessAreas?.[0]?.name || "",
        township: addressComponent.township || "",
      };

      // 触发事件，向父组件传递位置信息
      emit("updateLocation", locationInfo.value);
    } else {
      console.log("获取地址失败");
    }
  });
};

// **组件销毁时清理**
onUnmounted(() => {
  if (marker) {
    map?.remove(marker);
  }
  map?.destroy();
});
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
}

#container {
  width: 100%;
  height: 300px;
}

.location-info {
  margin-top: 10px;
  padding: 12px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
}

.info-item {
  margin-bottom: 6px;
  font-size: 14px;
  color: #666;
}

.info-item span {
  color: #333;
  font-weight: 500;
}
</style>
