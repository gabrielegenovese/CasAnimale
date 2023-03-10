<script setup>
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/vue";
import { Bars3Icon, XMarkIcon, UserIcon } from "@heroicons/vue/24/outline";
import Const from "../router/utils.js";

const navigation = [
  { name: "Services", href: "services", current: false },
  { name: "Visit our website", href: Const.FOURL, current: false },
  { name: "Ranking", href: Const.FOURL + "/boards", current: "false" },
];

const isLoggedIn = () => {
  let name = "token";
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    let token = parts.pop().split(";").shift();
    // console.log("token", token);
    return true;
  }
  return false;
};

const logout = () => {
  document.cookie = "token=; Max-Age=-99999999;";
  document.location.reload();
};
</script>

<template>
  <Disclosure as="nav" class="bg-blue-50" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <DisclosureButton
            class="inline-flex items-center justify-center m-0 rounded-md p-2 text-gray-500 hover:text-white"
          >
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
        <div
          class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start"
        >
          <div class="flex flex-row flex-shrink-0 items-center">
            <img src="/CasAnimale.png" alt="CasAnimale logo" class="hidden sm:flex h-12 w-12" />
            <a
              :href="Const.GAMEURL"
              className="place-content-center align-center block h-8 w-auto lg:hidden btn btn-ghost" aria-label="CasAnimale game button"
              ><img src="/CasAnimaleGame.png" alt="CasAnimale game logo" class="h-12 self-center ml-2 sm:ml-0" /></a
            >
            <a
              :href="Const.GAMEURL"
              className="place-content-center align-center hidden h-8 w-auto lg:block btn btn-ghost" aria-label="CasAnimale game button"
              ><img src="/CasAnimaleGame.png" alt="CasAnimale game logo" class="h-12 self-center ml-2 sm:ml-0" /></a
            >
          </div>
          <div class="hidden sm:ml-6 sm:block py-2">
            <div class="flex space-x-4">
              <a
                v-for="item in navigation"
                :key="item.name"
                :href="item.href"
                :class="[
                  'text-gray-900 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium',
                ]"
                :aria-current="undefined"
                >{{ item.name }}</a
              >
            </div>
          </div>
        </div>
        <div
          class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
        >
          <!-- Profile dropdown -->
          <Menu v-if="isLoggedIn()" as="div" class="relative ml-3">
            <div>
              <MenuButton
                class="flex m-0 rounded-full text-sm text-gray-500 hover:text-white"
              >
                <span class="sr-only">Open user menu</span>
                <UserIcon class="block h-7 w-7" aria-hidden="true" />
              </MenuButton>
            </div>
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems
                class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-200 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <MenuItem v-slot="{ active }">
                  <a
                    :href="Const.FOURL + '/profile'"
                    :class="[
                      active
                        ? 'block px-4 py-2 text-sm bg-gray-700 text-white'
                        : 'block px-4 py-2 text-sm text-gray-900',
                    ]"
                    >Your Profile</a
                  >
                </MenuItem>
                <MenuItem v-on:click="logout()" v-slot="{ active }">
                  <a
                    href="#"
                    :class="[
                      active
                        ? 'block px-4 py-2 text-sm bg-gray-700 text-white'
                        : 'block px-4 py-2 text-sm text-gray-900',
                    ]"
                    >Sign out</a
                  >
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </div>

    <DisclosurePanel class="sm:hidden">
      <div class="space-y-1 px-2 pt-2 pb-3">
        <DisclosureButton
          v-for="item in navigation"
          :key="item.name"
          as="a"
          :href="item.href"
          :class="[
            item.current
              ? 'bg-gray-900 text-white'
              : 'text-gray-900 hover:bg-gray-700 hover:text-white',
            'block px-3 py-2 rounded-md text-base font-medium',
          ]"
          :aria-current="item.current ? 'page' : undefined"
          >{{ item.name }}</DisclosureButton
        >
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>
