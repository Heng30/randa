<template>
  <div
    style="
      background-color: #545c64;
      height: 100%;
      flex: auto;
      align-items: center;
      justify-content: center;
      display: flex;
      cursor: move;
    "
    @mousedown="_mouseDown"
  ></div>
</template>

<script setup>
import { appWindow, PhysicalPosition } from '@tauri-apps/api/window';
import { ref, onMounted } from 'vue';

const isPressed = ref(false);
const oldScreenXY = ref([-1, -1]);
let factor = 1.0;

onMounted(async () => {
  factor = await appWindow.scaleFactor();

  document.onmousemove = _mouseMove;
  document.onmouseup = function() {
    isPressed.value = false;
  }
});

function _mouseDown(event) {
  event = event || window.event;
  oldScreenXY.value = [event.screenX, event.screenY];
  isPressed.value = true;
}

function _mouseMove(event) {
  if (!isPressed.value) return;
  event = event || window.event;
  if (oldScreenXY.value[0] >= 0 && oldScreenXY.value[1] >= 0) {
    _moveApp([
      event.screenX - oldScreenXY.value[0],
      event.screenY - oldScreenXY.value[1],
    ]);
  }
  oldScreenXY.value = [event.screenX, event.screenY];
}

async function _moveApp(offsetXY) {
  const position = await appWindow.innerPosition();
  const pp = new PhysicalPosition(
    position.x + offsetXY[0],
    position.y + offsetXY[1]
  );
  const logical = pp.toLogical(factor);
  await appWindow.setPosition(logical);
}
</script>
