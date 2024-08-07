$(document).ready(function() {
  // Main tab navigation
  $('.sidebar__tab').on('click', function() {
      var tabName = $(this).data('tab');
      activateTab('.sidebar__tab', '.cabinet__tab-content', tabName);
  });

  // Purchases tab navigation
  $('.purchases__tab').on('click', function() {
      var tabName = $(this).data('tab');
      activateTab('.purchases__tab', '.purchases__content', tabName);
  });

  // Questions tab navigation
  $('.questions__tab').on('click', function() {
      var tabName = $(this).data('tab');
      activateTab('.questions__tab', '.questions__content', tabName);
  });

  // Generic function to activate tabs
  function activateTab(tabSelector, contentSelector, tabName) {
      $(tabSelector).removeClass(tabSelector.replace('.', '') + '--active');
      $(contentSelector).removeClass(contentSelector.replace('.', '') + '--active');
      $(`${tabSelector}[data-tab="${tabName}"]`).addClass(tabSelector.replace('.', '') + '--active');
      $(`${contentSelector}#${tabName}`).addClass(contentSelector.replace('.', '') + '--active');
  }

  // Close notice
  $('.purchases__notice-close').on('click', function() {
      $(this).closest('.purchases__notice').slideUp();
  });

  // Item more button
  $('.purchases__item-more').on('click', function() {
      var targetId = $(this).data('target');
      alert('Действие для элемента с ID: ' + targetId);
  });

  // Avatar upload
  $('#avatar-upload').on('change', function(event) {
      var file = event.target.files[0];
      if (file) {
          var reader = new FileReader();
          reader.onload = function(e) {
              $('.user-info__image').attr('src', e.target.result);
          };
          reader.readAsDataURL(file);
      }
  });

  // Other button click handlers
  $('#activatePromo').on('click', function() {
      alert('Промокод активирован');
  });

  $('#logoutButton').on('click', function() {
      alert('Выход из аккаунта');
  });

  $('#changePhone').on('click', function() {
      $('#phone-view').hide();
      $('#phone-edit').show().focus();
  });

  $('#editPersonalInfo').on('click', function() {
      switchToEditMode();
  });

  $('#savePersonalInfo').on('click', function() {
      savePersonalInfo();
  });

  $('#changePassword').on('click', function() {
      alert('Смена пароля');
  });

  // Function to toggle empty state message for questions
  function toggleEmptyState() {
      var hasQuestions = $('.questions__item').length > 0;
      $('.questions__empty-message').toggle(!hasQuestions);
      $('.questions__content').toggle(hasQuestions);
  }

  // Call this function on page load and whenever questions are added/removed
  toggleEmptyState();

  $('.user-reviews__button').on('click', function() {
      $('.user-reviews__button').removeClass('user-reviews__button--active');
      $(this).addClass('user-reviews__button--active');
      
      var index = $(this).index();
      $('.user-reviews__content > div').hide().eq(index).show();
  });

  // Comments tab navigation
  $('.user-reviews__comments-tab').on('click', function() {
      $('.user-reviews__comments-tab').removeClass('user-reviews__comments-tab--active');
      $(this).addClass('user-reviews__comments-tab--active');
      
      var index = $(this).index();
      $('.user-reviews__comments-list').removeClass('user-reviews__comments-list--active').eq(index).addClass('user-reviews__comments-list--active');
  });

  function switchToEditMode() {
      $('.user-info__value').hide();
      $('.user-info__edit-input').show();
      $('#editPersonalInfo').hide();
      $('#savePersonalInfo').show();
  }

  function switchToViewMode() {
      $('.user-info__value').show();
      $('.user-info__edit-input').hide();
      $('#editPersonalInfo').show();
      $('#savePersonalInfo').hide();
  }

  function savePersonalInfo() {
      var dob = $('#dob-edit').val();
      var phone = $('#phone-edit').val();
      var email = $('#email-edit').val();
      var city = $('#city-edit').val();
      var gender = $('#gender-edit').val();

      // Fake API request
      $.ajax({
          url: 'https://example.com/api/updateUserInfo',
          method: 'POST',
          data: {
              dob: dob,
              phone: phone,
              email: email,
              city: city,
              gender: gender
          },
          success: function(response) {
              if (response.success) {
                  $('#dob-view').text(dob);
                  $('#phone-view').text(phone);
                  $('#email-view').text(email);
                  $('#city-view').text(city);
                  $('#gender-view').text(gender);
                  switchToViewMode();
                  alert('Личные данные успешно сохранены');
              } else {
                  alert('Ошибка при сохранении данных');
              }
          },
          error: function() {
              alert('Ошибка при выполнении запроса');
          }
      });
  }
});
