<template>
    <div>
      <!-- Glassy Overlay with Animation -->
      <Transition
        enter-active-class="transition-all duration-300 ease-in-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-300 ease-in-out"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isOpen"
          class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40"
          @click="closeModal"
        />
      </Transition>
  
      <!-- Sidebar -->
      <Transition
        enter-active-class="transition-all duration-300 ease-in-out"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition-all duration-300 ease-in-out"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
      >
        <aside
          v-if="isOpen"
          class="fixed top-0 right-0 z-50 h-full w-full sm:w-[480px] bg-white shadow-2xl overflow-hidden"
        >
          <!-- Header -->
          <div class="relative h-16 flex items-center justify-between px-6 border-b border-gray-100">
            <h2 class="text-xl font-semibold text-gray-900">Verification Services</h2>
            <button
              @click="closeModal"
              class="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            >
              <XIcon class="w-5 h-5" />
            </button>
          </div>
  
          <!-- Tabs -->
          <div class="border-b border-gray-100">
            <div class="px-6 -mb-px">
              <nav class="flex space-x-6 overflow-x-auto scrollbar-hide" aria-label="Tabs">
                <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  @click="activeTab = tab.id"
                  class="py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200"
                  :class="[
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  ]"
                >
                  {{ tab.name }}
                </button>
              </nav>
            </div>
          </div>
  
          <!-- Content -->
          <div class="h-[calc(100vh-8rem)] overflow-y-auto">
            <div class="p-6 space-y-6">
              <!-- BVN Lookup -->
              <TransitionGroup
                v-if="activeTab === 'bvn'"
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 -translate-y-4"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-200 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-4"
              >
                <div key="bvn-title" class="space-y-1">
                  <h3 class="text-lg font-semibold text-gray-900">BVN Lookup</h3>
                  <p class="text-sm text-gray-500">Verify identity using Bank Verification Number</p>
                </div>
  
                <div key="bvn-form" class="space-y-4">
                  <div class="space-y-2">
                    <label for="bvn" class="block text-sm font-medium text-gray-700">
                      Bank Verification Number (BVN)
                    </label>
                    <div class="relative">
                      <input
                        id="bvn"
                        v-model="bvnData.bvn"
                        type="text"
                        placeholder="Enter 11-digit BVN"
                        maxlength="11"
                        class="block w-full rounded-lg border-gray-200 pr-10 pl-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-primary focus:ring-primary sm:text-sm py-3 border-[0.5px] border-gray-100"
                        :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': bvnError }"
                      />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                        <CheckCircleIcon
                          v-if="bvnData.bvn.length === 11 && !bvnError"
                          class="h-5 w-5 text-green-500"
                        />
                        <XCircleIcon
                          v-if="bvnError"
                          class="h-5 w-5 text-red-500"
                        />
                      </div>
                    </div>
                    <p v-if="bvnError" class="text-sm text-red-600">{{ bvnError }}</p>
                  </div>
  
                  <button
                    @click="performBvnLookup"
                    :disabled="validatingBvn || !bvnData.bvn"
                    class="relative w-full rounded-lg bg-black py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <span :class="{ 'opacity-0': validatingBvn }">
                      Verify BVN
                    </span>
                    <div
                      v-if="validatingBvn"
                      class="absolute inset-0 flex items-center justify-center"
                    >
                      <svg
                        class="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        />
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    </div>
                  </button>
                </div>
  
                <!-- BVN Result -->
                <div 
                  v-if="bvnReport"
                  key="bvn-result"
                  class="mt-6 space-y-4"
                >
                  <div class="flex items-center justify-between bg-green-50 p-4 rounded-lg">
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0 bg-green-100 p-2 rounded-full">
                        <CheckCircleIcon class="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h4 class="font-medium text-green-800">Verification Successful</h4>
                        <p class="text-sm text-green-600">BVN details retrieved successfully</p>
                      </div>
                    </div>
                    <button 
                      @click="toggleBvnDetails"
                      class="text-green-700 hover:text-green-900"
                    >
                      <ChevronDownIcon v-if="!showBvnDetails" class="h-5 w-5" />
                      <ChevronUpIcon v-else class="h-5 w-5" />
                    </button>
                  </div>
  
                  <Transition
                    enter-active-class="transition-all duration-300 ease-out"
                    enter-from-class="opacity-0 max-h-0"
                    enter-to-class="opacity-100 max-h-[1000px]"
                    leave-active-class="transition-all duration-200 ease-in"
                    leave-from-class="opacity-100 max-h-[1000px]"
                    leave-to-class="opacity-0 max-h-0"
                  >
                    <div v-if="showBvnDetails" class="overflow-hidden">
                      <!-- Profile Section -->
                      <div class="bg-white rounded-lg border border-gray-100 overflow-hidden">
                        <div class="p-4 flex items-center space-x-4 border-b border-gray-100">
                          <div class="h-20 w-20 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                            <img 
                              v-if="bvnReport.base64Image" 
                              :src="`data:image/jpeg;base64,${bvnReport.base64Image}`" 
                              alt="Profile" 
                              class="h-full w-full object-cover"
                            />
                            <UserIcon v-else class="h-full w-full p-4 text-gray-400" />
                          </div>
                          <div>
                            <h4 class="text-lg font-medium text-gray-900">
                              {{ bvnReport.title }} {{ bvnReport.firstName }} {{ bvnReport.middleName }} {{ bvnReport.lastName }}
                            </h4>
                            <p class="text-sm text-gray-500">BVN: {{ bvnReport.bvn }}</p>
                          </div>
                        </div>
  
                        <!-- Personal Information -->
                        <div class="p-4 border-b border-gray-100">
                          <h5 class="font-medium text-gray-900 mb-3">Personal Information</h5>
                          <div class="grid grid-cols-2 gap-4">
                            <div>
                              <p class="text-xs text-gray-500">Date of Birth</p>
                              <p class="text-sm font-medium text-gray-900">{{ formatDate(bvnReport.dateOfBirth) }}</p>
                            </div>
                            <div>
                              <p class="text-xs text-gray-500">Gender</p>
                              <p class="text-sm font-medium text-gray-900">{{ bvnReport.gender }}</p>
                            </div>
                            <div>
                              <p class="text-xs text-gray-500">Marital Status</p>
                              <p class="text-sm font-medium text-gray-900">{{ bvnReport.maritalStatus }}</p>
                            </div>
                            <div>
                              <p class="text-xs text-gray-500">Nationality</p>
                              <p class="text-sm font-medium text-gray-900">{{ bvnReport.nationality }}</p>
                            </div>
                          </div>
                        </div>
  
                        <!-- Contact Information -->
                        <div class="p-4 border-b border-gray-100">
                          <h5 class="font-medium text-gray-900 mb-3">Contact Information</h5>
                          <div class="space-y-3">
                            <div>
                              <p class="text-xs text-gray-500">Email</p>
                              <p class="text-sm font-medium text-gray-900">{{ bvnReport.email || 'Not provided' }}</p>
                            </div>
                            <div>
                              <p class="text-xs text-gray-500">Phone Numbers</p>
                              <p class="text-sm font-medium text-gray-900">{{ bvnReport.phoneNumber1 }}</p>
                              <p v-if="bvnReport.phoneNumber2" class="text-sm font-medium text-gray-900">{{ bvnReport.phoneNumber2 }}</p>
                            </div>
                            <div>
                              <p class="text-xs text-gray-500">Residential Address</p>
                              <p class="text-sm font-medium text-gray-900">{{ bvnReport.residentialAddress }}</p>
                              <p class="text-sm font-medium text-gray-900">
                                {{ bvnReport.lgaOfResidence }}, {{ bvnReport.stateOfResidence }}
                              </p>
                            </div>
                          </div>
                        </div>
  
                        <!-- Origin Information -->
                        <div class="p-4 border-b border-gray-100">
                          <h5 class="font-medium text-gray-900 mb-3">Origin Information</h5>
                          <div class="grid grid-cols-2 gap-4">
                            <div>
                              <p class="text-xs text-gray-500">State of Origin</p>
                              <p class="text-sm font-medium text-gray-900">{{ bvnReport.stateOfOrigin }}</p>
                            </div>
                            <div>
                              <p class="text-xs text-gray-500">LGA of Origin</p>
                              <p class="text-sm font-medium text-gray-900">{{ bvnReport.lgaOfOrigin }}</p>
                            </div>
                          </div>
                        </div>
  
                        <!-- Bank Information -->
                        <div class="p-4">
                          <h5 class="font-medium text-gray-900 mb-3">Bank Information</h5>
                          <div class="grid grid-cols-2 gap-4">
                            <div>
                              <p class="text-xs text-gray-500">Enrollment Bank</p>
                              <p class="text-sm font-medium text-gray-900">{{ bvnReport.enrollmentBank }}</p>
                            </div>
                            <div>
                              <p class="text-xs text-gray-500">Enrollment Branch</p>
                              <p class="text-sm font-medium text-gray-900">{{ bvnReport.enrollmentBranch }}</p>
                            </div>
                            <div>
                              <p class="text-xs text-gray-500">Account Level</p>
                              <p class="text-sm font-medium text-gray-900">{{ bvnReport.levelOfAccount }}</p>
                            </div>
                            <div>
                              <p class="text-xs text-gray-500">Registration Date</p>
                              <p class="text-sm font-medium text-gray-900">{{ formatDate(bvnReport.registrationDate) }}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Transition>
                </div>
              </TransitionGroup>
  
              <!-- NIN Lookup -->
              <TransitionGroup
                v-if="activeTab === 'nin'"
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 -translate-y-4"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-200 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-4"
              >
                <div key="nin-title" class="space-y-1">
                  <h3 class="text-lg font-semibold text-gray-900">NIN Lookup</h3>
                  <p class="text-sm text-gray-500">Verify identity using National Identification Number</p>
                </div>
  
                <div key="nin-form" class="space-y-4">
                  <div class="space-y-2">
                    <label for="nin" class="block text-sm font-medium text-gray-700">
                      National Identification Number (NIN)
                    </label>
                    <div class="relative">
                      <input
                        id="nin"
                        v-model="ninData.nin"
                        type="text"
                        placeholder="Enter 11-digit NIN"
                        maxlength="11"
                        class="block w-full rounded-lg border-gray-200 pr-10 pl-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-primary focus:ring-primary sm:text-sm py-3 border-[0.5px] border-gray-100"
                        :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': ninError }"
                      />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                        <CheckCircleIcon
                          v-if="ninData.nin.length === 11 && !ninError"
                          class="h-5 w-5 text-green-500"
                        />
                        <XCircleIcon
                          v-if="ninError"
                          class="h-5 w-5 text-red-500"
                        />
                      </div>
                    </div>
                    <p v-if="ninError" class="text-sm text-red-600">{{ ninError }}</p>
                  </div>
  
                  <button
                    @click="performNinLookup"
                    :disabled="validatingNin || !ninData.nin"
                    class="relative w-full rounded-lg bg-black py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <span :class="{ 'opacity-0': validatingNin }">
                      Verify NIN
                    </span>
                    <div
                      v-if="validatingNin"
                      class="absolute inset-0 flex items-center justify-center"
                    >
                      <svg
                        class="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        />
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    </div>
                  </button>
                </div>
  
                <!-- NIN Result -->
                <div 
                  v-if="ninReport"
                  key="nin-result"
                  class="mt-6 space-y-4"
                >
                  <div class="flex items-center justify-between bg-green-50 p-4 rounded-lg">
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0 bg-green-100 p-2 rounded-full">
                        <CheckCircleIcon class="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h4 class="font-medium text-green-800">Verification Successful</h4>
                        <p class="text-sm text-green-600">NIN details retrieved successfully</p>
                      </div>
                    </div>
                    <button 
                      @click="toggleNinDetails"
                      class="text-green-700 hover:text-green-900"
                    >
                      <ChevronDownIcon v-if="!showNinDetails" class="h-5 w-5" />
                      <ChevronUpIcon v-else class="h-5 w-5" />
                    </button>
                  </div>
  
                  <Transition
                    enter-active-class="transition-all duration-300 ease-out"
                    enter-from-class="opacity-0 max-h-0"
                    enter-to-class="opacity-100 max-h-[1000px]"
                    leave-active-class="transition-all duration-200 ease-in"
                    leave-from-class="opacity-100 max-h-[1000px]"
                    leave-to-class="opacity-0 max-h-0"
                  >
                    <div v-if="showNinDetails" class="overflow-hidden">
                      <!-- Profile Section -->
                      <div class="bg-white rounded-lg border border-gray-100 overflow-hidden">
                        <div class="p-4 flex items-center space-x-4 border-b border-gray-100">
                          <div class="h-20 w-20 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                            <img 
                              v-if="ninReport.photo" 
                              :src="`data:image/jpeg;base64,${ninReport.photo}`" 
                              alt="Profile" 
                              class="h-full w-full object-cover"
                            />
                            <UserIcon v-else class="h-full w-full p-4 text-gray-400" />
                          </div>
                          <div>
                            <h4 class="text-lg font-medium text-gray-900">
                              {{ ninReport.title }} {{ ninReport.firstName }} {{ ninReport.middleName }} {{ ninReport.surname }}
                            </h4>
                            <div class="flex items-center space-x-2 mt-1">
                              <span class="text-sm text-gray-500">NIN: {{ ninReport.nin }}</span>
                              <span v-if="ninReport.nin" class="text-xs bg-gray-100 px-2 py-0.5 rounded">vNIN: {{ ninReport.nin }}</span>
                            </div>
                          </div>
                        </div>
  
                        <!-- Personal Information -->
                        <div class="p-4 border-b border-gray-100">
                          <h5 class="font-medium text-gray-900 mb-3">Personal Information</h5>
                          <div class="grid grid-cols-2 gap-4">
                            <div>
                              <p class="text-xs text-gray-500">Date of Birth</p>
                              <p class="text-sm font-medium text-gray-900">{{ formatDate(ninReport.birthDate) }}</p>
                            </div>
                            <div>
                              <p class="text-xs text-gray-500">Gender</p>
                              <p class="text-sm font-medium text-gray-900">{{ ninReport.gender }}</p>
                            </div>
                            <div>
                              <p class="text-xs text-gray-500">Employment Status</p>
                              <p class="text-sm font-medium text-gray-900">{{ ninReport.employmentStatus }}</p>
                            </div>
                            <div>
                              <p class="text-xs text-gray-500">Profession</p>
                              <p class="text-sm font-medium text-gray-900">{{ ninReport.profession || 'Not provided' }}</p>
                            </div>
                            <div v-if="ninReport.birthCountry">
                              <p class="text-xs text-gray-500">Birth Country</p>
                              <p class="text-sm font-medium text-gray-900">{{ ninReport.birthCountry }}</p>
                            </div>
                            <div v-if="ninReport.otherSpokenLang">
                              <p class="text-xs text-gray-500">Other Languages</p>
                              <p class="text-sm font-medium text-gray-900">{{ ninReport.otherSpokenLang }}</p>
                            </div>
                          </div>
                        </div>
  
                        <!-- Contact Information -->
                        <div class="p-4 border-b border-gray-100">
                          <h5 class="font-medium text-gray-900 mb-3">Contact Information</h5>
                          <div class="space-y-3">
                            <div>
                              <p class="text-xs text-gray-500">Email</p>
                              <p class="text-sm font-medium text-gray-900">{{ ninReport.email || 'Not provided' }}</p>
                            </div>
                            <div>
                              <p class="text-xs text-gray-500">Phone Number</p>
                              <p class="text-sm font-medium text-gray-900">{{ ninReport.telephoneNo }}</p>
                            </div>
                            <div>
                              <p class="text-xs text-gray-500">Residential Address</p>
                              <p class="text-sm font-medium text-gray-900">{{ ninReport.residenceAdressLine1 }}</p>
                              <p v-if="ninReport.residenceAdressLine2" class="text-sm font-medium text-gray-900">{{ ninReport.residenceAdressLine2 }}</p>
                              <p class="text-sm font-medium text-gray-900">
                                {{ ninReport.residenceLga }}, {{ ninReport.residenceState }}
                              </p>
                            </div>
                          </div>
                        </div>
  
                        <!-- Origin Information -->
                        <div class="p-4 border-b border-gray-100">
                          <h5 class="font-medium text-gray-900 mb-3">Origin Information</h5>
                          <div class="grid grid-cols-2 gap-4">
                            <div>
                              <p class="text-xs text-gray-500">State of Origin</p>
                              <p class="text-sm font-medium text-gray-900">{{ ninReport.selfOriginState }}</p>
                            </div>
                            <div v-if="ninReport.selfOriginLga">
                              <p class="text-xs text-gray-500">LGA of Origin</p>
                              <p class="text-sm font-medium text-gray-900">{{ ninReport.selfOriginLga }}</p>
                            </div>
                            <div v-if="ninReport.selfOriginPlace">
                              <p class="text-xs text-gray-500">Place of Origin</p>
                              <p class="text-sm font-medium text-gray-900">{{ ninReport.selfOriginPlace }}</p>
                            </div>
                          </div>
                        </div>
  
                        <!-- Next of Kin Information -->
                        <div v-if="ninReport.nokFirstName || ninReport.nokLastName" class="p-4">
                          <h5 class="font-medium text-gray-900 mb-3">Next of Kin Information</h5>
                          <div class="space-y-2">
                            <p class="text-sm font-medium text-gray-900">
                              {{ ninReport.nokFirstName }} {{ ninReport.nokMiddleName }} {{ ninReport.nokLastName }}
                            </p>
                          </div>
                        </div>
  
                        <!-- Tracking Information -->
                        <div class="p-4 bg-gray-50">
                          <div class="flex justify-between items-center">
                            <p class="text-xs text-gray-500">Tracking ID</p>
                            <p class="text-sm font-medium text-gray-900">{{ ninReport.trackingId }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Transition>
                </div>
              </TransitionGroup>
  
              <!-- Phone Number Lookup -->
              <TransitionGroup
                v-if="activeTab === 'phone'"
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 -translate-y-4"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-200 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-4"
              >
                <div key="phone-title" class="space-y-1">
                  <h3 class="text-lg font-semibold text-gray-900">Phone Number Lookup</h3>
                  <p class="text-sm text-gray-500">Verify phone number and network provider</p>
                </div>
  
                <div key="phone-form" class="space-y-4">
                  <div class="space-y-2">
                    <label for="phone" class="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div class="relative">
                      <input
                        id="phone"
                        v-model="phoneData.phoneNumber"
                        type="tel"
                        placeholder="Enter phone number (e.g., 08012345678)"
                        class="block w-full rounded-lg border-gray-200 pr-10 pl-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-primary focus:ring-primary sm:text-sm py-3 border-[0.5px] border-gray-100"
                        :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': phoneError }"
                      />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                        <CheckCircleIcon
                          v-if="phoneData.phoneNumber.length >= 11 && !phoneError"
                          class="h-5 w-5 text-green-500"
                        />
                        <XCircleIcon
                          v-if="phoneError"
                          class="h-5 w-5 text-red-500"
                        />
                      </div>
                    </div>
                    <p v-if="phoneError" class="text-sm text-red-600">{{ phoneError }}</p>
                  </div>
  
                  <button
                    @click="performPhoneLookup"
                    :disabled="validatingPhone || !phoneData.phoneNumber"
                    class="relative w-full rounded-lg bg-black py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <span :class="{ 'opacity-0': validatingPhone }">
                      Verify Phone Number
                    </span>
                    <div
                      v-if="validatingPhone"
                      class="absolute inset-0 flex items-center justify-center"
                    >
                      <svg
                        class="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        />
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    </div>
                  </button>
                </div>
  
                <!-- Phone Result -->
                <div 
                  v-if="phoneReport"
                  key="phone-result"
                  class="mt-6 space-y-4"
                >
                  <div class="flex items-center justify-between bg-green-50 p-4 rounded-lg">
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0 bg-green-100 p-2 rounded-full">
                        <CheckCircleIcon class="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h4 class="font-medium text-green-800">Verification Successful</h4>
                        <p class="text-sm text-green-600">Phone number details retrieved successfully</p>
                      </div>
                    </div>
                    <button 
                      @click="togglePhoneDetails"
                      class="text-green-700 hover:text-green-900"
                    >
                      <ChevronDownIcon v-if="!showPhoneDetails" class="h-5 w-5" />
                      <ChevronUpIcon v-else class="h-5 w-5" />
                    </button>
                  </div>
  
                  <Transition
                    enter-active-class="transition-all duration-300 ease-out"
                    enter-from-class="opacity-0 max-h-0"
                    enter-to-class="opacity-100 max-h-[1000px]"
                    leave-active-class="transition-all duration-200 ease-in"
                    leave-from-class="opacity-100 max-h-[1000px]"
                    leave-to-class="opacity-0 max-h-0"
                  >
                    <div v-if="showPhoneDetails" class="overflow-hidden">
                      <!-- Profile Section -->
                      <div class="bg-white rounded-lg border border-gray-100 overflow-hidden">
                        <div class="p-4 flex items-center space-x-4 border-b border-gray-100">
                          <div class="h-20 w-20 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                            <img 
                              v-if="phoneReport.photo" 
                              :src="`data:image/jpeg;base64,${phoneReport.photo}`" 
                              alt="Profile" 
                              class="h-full w-full object-cover"
                            />
                            <UserIcon v-else class="h-full w-full p-4 text-gray-400" />
                          </div>
                          <div>
                            <h4 class="text-lg font-medium text-gray-900">
                              {{ phoneReport.title }} {{ phoneReport.firstName }} {{ phoneReport.middleName }} {{ phoneReport.surname }}
                            </h4>
                            <p class="text-sm text-gray-500">Phone: {{ phoneReport.telephoneNo }}</p>
                          </div>
                        </div>
  
                        <!-- Personal Information -->
                        <div class="p-4 border-b border-gray-100">
                          <h5 class="font-medium text-gray-900 mb-3">Personal Information</h5>
                          <div class="grid grid-cols-2 gap-4">
                            <div>
                              <p class="text-xs text-gray-500">Date of Birth</p>
                              <p class="text-sm font-medium text-gray-900">{{ formatDate(phoneReport.birthDate) }}</p>
                            </div>
                            <div>
                              <p class="text-xs text-gray-500">Gender</p>
                              <p class="text-sm font-medium text-gray-900">{{ phoneReport.gender }}</p>
                            </div>
                            <div>
                              <p class="text-xs text-gray-500">Employment Status</p>
                              <p class="text-sm font-medium text-gray-900">{{ phoneReport.employmentStatus }}</p>
                            </div>
                            <div v-if="phoneReport.nin">
                              <p class="text-xs text-gray-500">NIN</p>
                              <p class="text-sm font-medium text-gray-900">{{ phoneReport.nin }}</p>
                            </div>
                          </div>
                        </div>
  
                        <!-- Contact Information -->
                        <div class="p-4 border-b border-gray-100">
                          <h5 class="font-medium text-gray-900 mb-3">Contact Information</h5>
                          <div class="space-y-3">
                            <div>
                              <p class="text-xs text-gray-500">Email</p>
                              <p class="text-sm font-medium text-gray-900">{{ phoneReport.email || 'Not provided' }}</p>
                            </div>
                            <div>
                              <p class="text-xs text-gray-500">Residential Address</p>
                              <p class="text-sm font-medium text-gray-900">{{ phoneReport.residenceAdressLine1 }}</p>
                              <p class="text-sm font-medium text-gray-900">
                                {{ phoneReport.residenceLga }}, {{ phoneReport.residenceState }}
                              </p>
                            </div>
                          </div>
                        </div>
  
                        <!-- Origin Information -->
                        <div class="p-4">
                          <h5 class="font-medium text-gray-900 mb-3">Origin Information</h5>
                          <div>
                            <p class="text-xs text-gray-500">State of Origin</p>
                            <p class="text-sm font-medium text-gray-900">{{ phoneReport.selfOriginState }}</p>
                          </div>
                        </div>
  
                        <!-- Tracking Information -->
                        <div class="p-4 bg-gray-50">
                          <div class="flex justify-between items-center">
                            <p class="text-xs text-gray-500">Tracking ID</p>
                            <p class="text-sm font-medium text-gray-900">{{ phoneReport.trackingId }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Transition>
                </div>
              </TransitionGroup>
  
              <!-- ID Verification -->
              <TransitionGroup
                v-if="activeTab === 'id'"
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 -translate-y-4"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-200 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-4"
              >
                <div key="id-title" class="space-y-1">
                  <h3 class="text-lg font-semibold text-gray-900">ID Verification</h3>
                  <p class="text-sm text-gray-500">Verify identity using official identification documents</p>
                </div>
  
                <div key="id-form" class="space-y-4">
                  <div class="space-y-2">
                    <label for="idType" class="block text-sm font-medium text-gray-700">
                      ID Type
                    </label>
                    <select
                      id="idType"
                      v-model="idData.idType"
                      class="block w-full py-3 border-[0.5px] pl-3 border-gray-100 rounded-lg border-gray-200 text-gray-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    >
                      <option value="" disabled>Select ID Type</option>
                      <option value="passport">International Passport</option>
                      <option value="drivers_license">Driver's License</option>
                      <option value="voters_card">Voter's Card</option>
                      <option value="national_id">National ID Card</option>
                    </select>
                  </div>
  
                  <div class="space-y-2">
                    <label for="idNumber" class="block text-sm font-medium text-gray-700">
                      ID Number
                    </label>
                    <div class="relative">
                      <input
                        id="idNumber"
                        v-model="idData.idNumber"
                        type="text"
                        placeholder="Enter ID number"
                        class="block w-full rounded-lg border-gray-200 pr-10 pl-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-primary focus:ring-primary sm:text-sm py-3 border-[0.5px] border-gray-100"
                        :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': idError }"
                      />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                        <CheckCircleIcon
                          v-if="idData.idNumber && !idError"
                          class="h-5 w-5 text-green-500"
                        />
                        <XCircleIcon
                          v-if="idError"
                          class="h-5 w-5 text-red-500"
                        />
                      </div>
                    </div>
                    <p v-if="idError" class="text-sm text-red-600">{{ idError }}</p>
                  </div>
  
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">
                      Upload ID Document (Optional)
                    </label>
                    <div
                      @click="triggerFileUpload"
                      class="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <input
                        ref="fileInput"
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        class="hidden"
                        @change="handleFileUpload"
                      />
                      <UploadIcon class="mx-auto h-8 w-8 text-gray-400" />
                      <p class="mt-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                      <p class="text-xs text-gray-400">PNG, JPG or PDF up to 5MB</p>
                    </div>
                    <div v-if="idData.file" class="flex items-center mt-2">
                      <FileIcon class="h-4 w-4 text-gray-400" />
                      <span class="ml-2 text-sm text-gray-500">{{ idData.file.name }}</span>
                      <button
                        @click.prevent="idData.file = null"
                        class="ml-2 text-red-500 hover:text-red-700"
                      >
                        <XIcon class="h-4 w-4" />
                      </button>
                    </div>
                  </div>
  
                  <button
                    @click="performIdVerification"
                    :disabled="isLoading || !idData.idType || !idData.idNumber"
                    class="relative w-full rounded-lg bg-black py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <span :class="{ 'opacity-0': isLoading }">
                      Verify ID
                    </span>
                    <div
                      v-if="isLoading"
                      class="absolute inset-0 flex items-center justify-center"
                    >
                      <svg
                        class="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        />
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    </div>
                  </button>
                </div>
  
                <!-- ID Result -->
                <TransitionGroup
                  v-if="idResult"
                  key="id-result"
                  enter-active-class="transition-all duration-300 ease-out"
                  enter-from-class="opacity-0 scale-95"
                  enter-to-class="opacity-100 scale-100"
                  leave-active-class="transition-all duration-200 ease-in"
                  leave-from-class="opacity-100 scale-100"
                  leave-to-class="opacity-0 scale-95"
                  class="mt-6 rounded-lg bg-gray-50 p-4 space-y-3"
                >
                  <div key="result-header" class="flex items-center space-x-2">
                    <CheckCircleIcon v-if="idResult.verified" class="h-5 w-5 text-green-500" />
                    <XCircleIcon v-else class="h-5 w-5 text-red-500" />
                    <h4 class="font-medium text-gray-900">
                      {{ idResult.verified ? 'Verification Successful' : 'Verification Failed' }}
                    </h4>
                  </div>
  
                  <div key="result-content" class="space-y-3 pl-7">
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-500">Status</span>
                      <span 
                        class="font-medium"
                        :class="idResult.verified ? 'text-green-600' : 'text-red-600'"
                      >
                        {{ idResult.verified ? 'Verified' : 'Not Verified' }}
                      </span>
                    </div>
                    <div v-if="idResult.message" class="flex justify-between text-sm">
                      <span class="text-gray-500">Message</span>
                      <span class="font-medium text-gray-900">{{ idResult.message }}</span>
                    </div>
                  </div>
                </TransitionGroup>
              </TransitionGroup>
  
              <!-- Statement Analysis -->
              <TransitionGroup
                v-if="activeTab === 'statement'"
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 -translate-y-4"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-200 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-4"
              >
                <div key="statement-title" class="space-y-1">
                  <h3 class="text-lg font-semibold text-gray-900">Statement Analysis</h3>
                  <p class="text-sm text-gray-500">Upload and analyze bank statements</p>
                </div>
  
                <div key="statement-form" class="space-y-4">
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">
                      Upload Bank Statement
                    </label>
                    <div
                      @click="triggerStatementUpload"
                      class="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <input
                        ref="statementInput"
                        type="file"
                        accept=".pdf"
                        class="hidden"
                        @change="handleStatementUpload"
                      />
                      <UploadIcon class="mx-auto h-8 w-8 text-gray-400" />
                      <p class="mt-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                      <p class="text-xs text-gray-400">PDF format up to 10MB</p>
                    </div>
                    <div v-if="statementData.file" class="flex items-center mt-2">
                      <FileIcon class="h-4 w-4 text-gray-400" />
                      <span class="ml-2 text-sm text-gray-500">{{ statementData.file.name }}</span>
                      <button
                        @click.prevent="statementData.file = null"
                        class="ml-2 text-red-500 hover:text-red-700"
                      >
                        <XIcon class="h-4 w-4" />
                      </button>
                    </div>
                  </div>
  
                  <div class="space-y-2">
                    <label for="bankName" class="block text-sm font-medium text-gray-700">
                      Bank Name
                    </label>
                    <select
                      id="bankName"
                      v-model="statementData.bankName"
                      class="block w-full py-3 pl-3 border-[0.5px] border-gray-100 rounded-lg border-gray-200 text-gray-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    >
                      <option value="" disabled>Select Bank</option>
                      <option value="access">Access Bank</option>
                      <option value="gtb">Guaranty Trust Bank</option>
                      <option value="zenith">Zenith Bank</option>
                      <option value="first">First Bank</option>
                      <option value="uba">UBA</option>
                    </select>
                  </div>
  
                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <label for="fromDate" class="block text-sm font-medium text-gray-700">
                        From Date
                      </label>
                      <input
                        id="fromDate"
                        v-model="statementData.fromDate"
                        type="date"
                        class="block w-full py-3 pl-3 border-[0.5px] border-gray-100 rounded-lg border-gray-200 text-gray-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                    <div class="space-y-2">
                      <label for="toDate" class="block text-sm font-medium text-gray-700">
                        To Date
                      </label>
                      <input
                        id="toDate"
                        v-model="statementData.toDate"
                        type="date"
                        class="block w-full py-3 pl-3 border-[0.5px] border-gray-100 rounded-lg border-gray-200 text-gray-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                  </div>
  
                  <button
                    @click="analyzeStatement"
                    :disabled="isLoading || !statementData.file || !statementData.bankName"
                    class="relative w-full rounded-lg bg-black py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <span :class="{ 'opacity-0': isLoading }">
                      Analyze Statement
                    </span>
                    <div
                      v-if="isLoading"
                      class="absolute inset-0 flex items-center justify-center"
                    >
                      <svg
                        class="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        />
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    </div>
                  </button>
                </div>
  
                <!-- Statement Result -->
                <TransitionGroup
                  v-if="statementResult"
                  key="statement-result"
                  enter-active-class="transition-all duration-300 ease-out"
                  enter-from-class="opacity-0 scale-95"
                  enter-to-class="opacity-100 scale-100"
                  leave-active-class="transition-all duration-200 ease-in"
                  leave-from-class="opacity-100 scale-100"
                  leave-to-class="opacity-0 scale-95"
                  class="mt-6 rounded-lg bg-gray-50 p-4 space-y-3"
                >
                  <div key="result-header" class="flex items-center space-x-2">
                    <CheckCircleIcon class="h-5 w-5 text-green-500" />
                    <h4 class="font-medium text-gray-900">Analysis Complete</h4>
                  </div>
  
                  <div key="result-content" class="space-y-4 pl-7">
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-500">Average Monthly Income</span>
                      <span class="font-medium text-gray-900">
                        ₦{{ statementResult.averageIncome.toLocaleString() }}
                      </span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-500">Average Monthly Expense</span>
                      <span class="font-medium text-gray-900">
                        ₦{{ statementResult.averageExpense.toLocaleString() }}
                      </span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-500">Recurring Transactions</span>
                      <span class="font-medium text-gray-900">
                        {{ statementResult.recurringTransactions }}
                      </span>
                    </div>
                    <div class="space-y-2">
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-500">Risk Score</span>
                        <span class="font-medium text-gray-900">
                          {{ statementResult.riskScore }}%
                        </span>
                      </div>
                      <div class="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                          class="h-full rounded-full transition-all duration-500"
                          :style="{
                            width: `${statementResult.riskScore}%`,
                            backgroundColor: getRiskColor(statementResult.riskScore)
                          }"
                        />
                      </div>
                      <p class="text-xs text-gray-500 text-right">
                        {{ getRiskLabel(statementResult.riskScore) }}
                      </p>
                    </div>
                  </div>
                </TransitionGroup>
              </TransitionGroup>
            </div>
          </div>
        </aside>
      </Transition>
  
      <!-- Floating Action Button -->
      <button
        v-if="!isOpen"
        @click="openModal"
        class="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 hover:scale-105"
      >
        <UserCheckIcon class="h-6 w-6" />
        <span class="sr-only">Open Verification Services</span>
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useValidateBvn } from '@/composables/modules/kyc/useValidateBvn'
  import { useValidateNin } from '@/composables/modules/kyc/useValidateNin'
  import { useValidatePhone } from '@/composables/modules/kyc/useValidatePhone'
  import { ref, onUnmounted } from 'vue'
  import {
    XIcon,
    UserCheckIcon,
    CheckCircleIcon,
    XCircleIcon,
    UploadIcon,
    FileIcon,
    UserIcon,
    ChevronDownIcon,
    ChevronUpIcon
  } from 'lucide-vue-next'
  
  const { validateBvn, loading: validatingBvn, validateReport: bvnReport } = useValidateBvn()
  const { validateNin, loading: validatingNin, validateReport: ninReport } = useValidateNin()
  const { validatePhone, loading: validatingPhone, validateReport: phoneReport } = useValidatePhone()
  
  // Types
  interface Tab {
    id: string
    name: string
  }
  
  interface BvnData {
    bvn: string
  }
  
  interface NinData {
    nin: string
  }
  
  interface PhoneData {
    phoneNumber: string
  }
  
  interface IdData {
    idType: string
    idNumber: string
    file: File | null
  }
  
  interface StatementData {
    file: File | null
    bankName: string
    fromDate: string
    toDate: string
  }
  
  interface IdResult {
    verified: boolean
    message: string
  }
  
  interface StatementResult {
    averageIncome: number
    averageExpense: number
    recurringTransactions: number
    riskScore: number
  }
  
  // State
  const isOpen = ref(false)
  const isLoading = ref(false)
  const activeTab = ref('bvn')
  const fileInput = ref<HTMLInputElement | null>(null)
  const statementInput = ref<HTMLInputElement | null>(null)
  
  // Detail toggle states
  const showBvnDetails = ref(true)
  const showNinDetails = ref(true)
  const showPhoneDetails = ref(true)
  
  // Form data
  const bvnData = ref<BvnData>({ bvn: '' })
  const ninData = ref<NinData>({ nin: '' })
  const phoneData = ref<PhoneData>({ phoneNumber: '' })
  const idData = ref<IdData>({ idType: '', idNumber: '', file: null })
  const statementData = ref<StatementData>({
    file: null,
    bankName: '',
    fromDate: '',
    toDate: ''
  })
  
  // Validation errors
  const bvnError = ref('')
  const ninError = ref('')
  const phoneError = ref('')
  const idError = ref('')
  
  // Results
  const idResult = ref<IdResult | null>(null)
  const statementResult = ref<StatementResult | null>(null)
  
  // Tabs
  const tabs = ref<Tab[]>([
    { id: 'bvn', name: 'BVN Lookup' },
    { id: 'nin', name: 'NIN Lookup' },
    { id: 'phone', name: 'Phone Lookup' },
    { id: 'id', name: 'ID Verification' },
    { id: 'statement', name: 'Statement Analysis' },
  ])
  
  // Modal control methods
  const openModal = () => {
    isOpen.value = true
    document.body.style.overflow = 'hidden'
  }
  
  const closeModal = () => {
    isOpen.value = false
    document.body.style.overflow = ''
  }
  
  // Toggle details
  const toggleBvnDetails = () => {
    showBvnDetails.value = !showBvnDetails.value
  }
  
  const toggleNinDetails = () => {
    showNinDetails.value = !showNinDetails.value
  }
  
  const togglePhoneDetails = () => {
    showPhoneDetails.value = !showPhoneDetails.value
  }
  
  // File upload handlers
  const triggerFileUpload = () => {
    fileInput.value?.click()
  }
  
  const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
      idData.value.file = target.files[0]
    }
  }
  
  const triggerStatementUpload = () => {
    statementInput.value?.click()
  }
  
  const handleStatementUpload = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
      statementData.value.file = target.files[0]
    }
  }
  
  // API calls
  const performBvnLookup = async () => {
    bvnError.value = ''
    
    if (!bvnData.value.bvn) {
      bvnError.value = 'BVN is required'
      return
    }
    
    if (!/^\d{11}$/.test(bvnData.value.bvn)) {
      bvnError.value = 'BVN must be 11 digits'
      return
    }
    
    try {
      await validateBvn({ bvn: bvnData.value.bvn })
    } catch (error) {
      console.error('BVN lookup failed:', error)
      bvnError.value = 'BVN verification failed. Please try again.'
    }
  }
  
  const performNinLookup = async () => {
    ninError.value = ''
    
    if (!ninData.value.nin) {
      ninError.value = 'NIN is required'
      return
    }
    
    if (!/^\d{11}$/.test(ninData.value.nin)) {
      ninError.value = 'NIN must be 11 digits'
      return
    }
    
    try {
      await validateNin({ nin: ninData.value.nin })
    } catch (error) {
      console.error('NIN lookup failed:', error)
      ninError.value = 'NIN verification failed. Please try again.'
    }
  }
  
  const performPhoneLookup = async () => {
    phoneError.value = ''
    
    if (!phoneData.value.phoneNumber) {
      phoneError.value = 'Phone number is required'
      return
    }
    
    if (!/^(0|\+234)[789][01]\d{8}$/.test(phoneData.value.phoneNumber)) {
      phoneError.value = 'Enter a valid Nigerian phone number'
      return
    }
    
    try {
      await validatePhone({ phoneNumber: phoneData.value.phoneNumber })
    } catch (error) {
      console.error('Phone lookup failed:', error)
      phoneError.value = 'Phone verification failed. Please try again.'
    }
  }
  
  const performIdVerification = async () => {
    if (!validateId()) return
    
    try {
      isLoading.value = true
      await new Promise(resolve => setTimeout(resolve, 1500))
      idResult.value = {
        verified: true,
        message: 'ID successfully verified'
      }
    } catch (error) {
      console.error('ID verification failed:', error)
      idError.value = 'ID verification failed. Please try again.'
    } finally {
      isLoading.value = false
    }
  }
  
  const validateId = (): boolean => {
    idError.value = ''
    
    if (!idData.value.idType) {
      idError.value = 'ID type is required'
      return false
    }
    
    if (!idData.value.idNumber) {
      idError.value = 'ID number is required'
      return false
    }
    
    return true
  }
  
  const analyzeStatement = async () => {
    if (!statementData.value.file || !statementData.value.bankName) return
    
    try {
      isLoading.value = true
      await new Promise(resolve => setTimeout(resolve, 2000))
      statementResult.value = {
        averageIncome: 350000,
        averageExpense: 280000,
        recurringTransactions: 5,
        riskScore: 25
      }
    } catch (error) {
      console.error('Statement analysis failed:', error)
    } finally {
      isLoading.value = false
    }
  }
  
  // Helper functions
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A'
    
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-NG', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    } catch (error) {
      return dateString
    }
  }
  
  const getRiskColor = (score: number): string => {
    if (score < 30) return '#10B981' // Green - low risk
    if (score < 70) return '#F59E0B' // Yellow - medium risk
    return '#EF4444' // Red - high risk
  }
  
  const getRiskLabel = (score: number): string => {
    if (score < 30) return 'Low Risk'
    if (score < 70) return 'Medium Risk'
    return 'High Risk'
  }
  
  // Cleanup on component unmount
  onUnmounted(() => {
    document.body.style.overflow = ''
  })
  </script>
  
  <style scoped>
  /* Hide scrollbar for Chrome, Safari and Opera */
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  /* Hide scrollbar for IE, Edge and Firefox */
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  
  :root {
    --color-primary: #6366f1;
    --color-primary-dark: #4f46e5;
  }
  
  .bg-primary {
    background-color: var(--color-primary);
  }
  
  .text-primary {
    color: var(--color-primary);
  }
  
  .border-primary {
    border-color: var(--color-primary);
  }
  
  .hover\:bg-primary-dark:hover {
    background-color: var(--color-primary-dark);
  }
  
  .focus\:ring-primary:focus {
    --tw-ring-color: var(--color-primary);
  }
  
  .focus\:border-primary:focus {
    border-color: var(--color-primary);
  }
  </style>