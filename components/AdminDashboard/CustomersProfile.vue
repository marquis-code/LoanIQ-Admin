<template>
    <div>
        <div class="pb-1 sm:pb-6">
          <div>
            <div class="relative h-40 sm:h-56">
              <img class="absolute h-full w-full object-cover" src="https://images.unsplash.com/photo-1501031170107-cfd33f0cbdcc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&h=600&q=80" alt="">
            </div>
            <div class="mt-6 px-4 sm:mt-8 sm:flex sm:items-end sm:px-6">
              <div class="sm:flex-1">
                <div>
                  <div class="flex items-center">
                    <h3 class="text-xl font-bold text-gray-900 sm:text-2xl">Ashley Porter</h3>
                    <span class="ml-2.5 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-green-400">
                      <span class="sr-only">Online</span>
                    </span>
                  </div>
                  <p class="text-sm text-gray-500">@ashleyporter</p>
                </div>
                <div class="mt-5 flex flex-wrap space-y-3 sm:space-x-3 sm:space-y-0">
                  <button type="button" class="inline-flex w-full flex-shrink-0 items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:flex-1">Message</button>
                  <button type="button" class="inline-flex w-full flex-1 items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Call</button>
                  <div class="ml-3 inline-flex sm:ml-0">
                    <div class="relative inline-block text-left">
                      <button type="button" class="relative inline-flex items-center rounded-md bg-white p-2 text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" id="options-menu-button" aria-expanded="false" aria-haspopup="true">
                        <span class="absolute -inset-1"></span>
                        <span class="sr-only">Open options menu</span>
                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                          <path d="M10 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM10 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM11.5 15.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
                        </svg>
                      </button>

                      <!--
                        Dropdown panel, show/hide based on dropdown state.

                        Entering: "transition ease-out duration-100"
                          From: "transform opacity-0 scale-95"
                          To: "transform opacity-100 scale-100"
                        Leaving: "transition ease-in duration-75"
                          From: "transform opacity-100 scale-100"
                          To: "transform opacity-0 scale-95"
                      -->
                      <div class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="options-menu-button" tabindex="-1">
                        <div class="py-1" role="none">
                          <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->
                          <a href="#" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="options-menu-item-0">View profile</a>
                          <a href="#" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="options-menu-item-1">Copy profile link</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="px-4 pb-5 pt-5 sm:px-0 sm:pt-0">
          <dl class="space-y-8 px-4 sm:space-y-6 sm:px-6">
            <div>
              <dt class="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">Bio</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:col-span-2">
                <p>Enim feugiat ut ipsum, neque ut. Tristique mi id elementum praesent. Gravida in tempus feugiat netus enim aliquet a, quam scelerisque. Dictumst in convallis nec in bibendum aenean arcu.</p>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">Location</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:col-span-2">New York, NY, USA</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">Website</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:col-span-2">ashleyporter.com</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">Birthday</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:col-span-2">
                <time datetime="1988-06-23">June 23, 1988</time>
              </dd>
            </div>
          </dl>
        </div>
      </div>
</template>

<script setup lang="ts">
const props = defineProps({
    agent: {
        type: Object
    }
})
</script>
