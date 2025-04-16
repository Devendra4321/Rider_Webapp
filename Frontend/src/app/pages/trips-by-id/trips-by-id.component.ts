import { Component, ViewChild } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../environment/environment';
import { RideService } from '../../services/ride/ride.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { MapComponent } from '../../components/map/map.component';
import Swal from 'sweetalert2';
import { ReviewService } from '../../services/review/review.service';

@Component({
    selector: 'app-trips-by-id',
    templateUrl: './trips-by-id.component.html',
    styleUrl: './trips-by-id.component.css',
    standalone: false
})
export class TripsByIdComponent {
  constructor(
    private rideService: RideService,
    private reviewService: ReviewService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private route: ActivatedRoute
  ) {}

  @ViewChild(MapComponent) mapComponent!: MapComponent;

  rideId: any;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.rideId = params.get('rideId')!;
      // console.log('Ride ID:', this.rideId);
    });

    this.getRideById(this.rideId);
  }

  rideDetail: any = {};

  getRideById(rideId: any) {
    this.spinner.show();

    this.rideService.rideGetById(rideId).subscribe({
      next: (result: any) => {
        if (result.statusCode == 200) {
          this.spinner.hide();
          this.rideDetail = result.ride;
          console.log('Ride get by id data', result);
          setTimeout(
            () =>
              this.drawRoute(
                result.ride.pickupLatLng,
                result.ride.destinationLatLng
              ),
            2000
          );
        }
      },
      error: (error) => {
        console.log('Ride get by id data error', error.error);

        if (
          error.error.statusCode == 400 ||
          error.error.statusCode == 404 ||
          error.error.statusCode == 500
        ) {
          this.spinner.hide();
          this.toaster.error(error.error.message);
        } else {
          this.toaster.error('Something went wrong');
        }
      },
      complete: () => {
        this.spinner.hide();
      },
    });
  }

  drawRoute(pickup: any, drop: any) {
    // console.log(pickup, drop);
    this.mapComponent.addRoute(
      [pickup?.lng, pickup?.ltd],
      [drop?.lng, drop?.ltd]
    );
  }

  review = {
    ride: "",
    "overallRating": 0,
    "vehicleRating": 0,
    "onTimeRating": 0,
    "driverBehaviourRating": 0,
    "comment": ""
  }

  async reviewPopUp() {
    let overallRating = 0;
    let driverBehaviourRating = 0;
    let vehicleRating = 0;
    let onTimeRating = 0;
  
    const { value: comment } = await Swal.fire({
      title: "<strong class='fw-bold'>Leave a Review</strong>",
      html: `
        <p class="mb-3">Please share your feedback below</p>
  
        <div class="d-flex justify-content-around flex-wrap">
          <!-- First set of stars -->
          <div>
            <p class="mb-2 fw-semibold">🙌 Overall Experience</p>
            <div id="star-container1" style="display: flex; flex-direction: row-reverse; margin: 0 0 15px 0;">
              ${[5, 4, 3, 2, 1].map(i => `
                <span 
                  class="star1" 
                  data-value="${i}" 
                  style="font-size: 28px; cursor: pointer; color: #ccc; padding: 0 4px;">★</span>
              `).join('')}
            </div>
          </div>
    
          <!-- Second set of stars -->
          <div>
            <p class="mb-2 fw-semibold">🫡 Rating for Captain</p>
            <div id="star-container2" style="display: flex; flex-direction: row-reverse; margin: 0 0 15px 0;">
              ${[5, 4, 3, 2, 1].map(i => `
                <span 
                  class="star2" 
                  data-value="${i}" 
                  style="font-size: 28px; cursor: pointer; color: #ccc; padding: 0 4px;">★</span>
              `).join('')}
            </div>
          </div>
        </div>
  
        <div class="d-flex justify-content-around flex-wrap">
          <!-- Third set of stars -->
          <div>
          <p class="mb-2 fw-semibold">🧼 Rating for Vehicle</p>
            <div id="star-container3" style="display: flex; flex-direction: row-reverse; margin: 0 0 15px 0;">
              ${[5, 4, 3, 2, 1].map(i => `
                <span 
                  class="star3" 
                  data-value="${i}" 
                  style="font-size: 28px; cursor: pointer; color: #ccc; padding: 0 4px;">★</span>
              `).join('')}
            </div>
          </div>

          <!-- Fourth set of stars -->
          <div>
          <p class="mb-2 fw-semibold">🕒 Rating for Ontime</p>
            <div id="star-container4" style="display: flex; flex-direction: row-reverse; margin: 0 0 15px 0;">
              ${[5, 4, 3, 2, 1].map(i => `
                <span 
                  class="star4" 
                  data-value="${i}" 
                  style="font-size: 28px; cursor: pointer; color: #ccc; padding: 0 4px;">★</span>
              `).join('')}
            </div>
          </div>
        </div>
      `,
      input: "textarea",
      inputPlaceholder: "Type your comment here...",
      inputValidator: (value) => {
        if (overallRating === 0 || driverBehaviourRating === 0 || vehicleRating === 0 || onTimeRating === 0) {
          return "Please provide a rating for all categories!";
        }
        return null;
      },
      showCancelButton: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      allowOutsideClick: false,
      didOpen: () => {
        const stars1 = document.querySelectorAll('.star1');
        const stars2 = document.querySelectorAll('.star2');
        const stars3 = document.querySelectorAll('.star3');
        const stars4 = document.querySelectorAll('.star4');
  
        // Hover and click handling for the first set of stars
        stars1.forEach(star => {
          const value = parseInt(star.getAttribute('data-value') || '0');
  
          star.addEventListener('mouseenter', () => {
            highlightStars(stars1, value);
          });
  
          star.addEventListener('mouseleave', () => {
            highlightStars(stars1, overallRating);
          });
  
          star.addEventListener('click', () => {
            overallRating = value;
            highlightStars(stars1, overallRating);
          });
        });
  
        // Hover and click handling for the second set of stars
        stars2.forEach(star => {
          const value = parseInt(star.getAttribute('data-value') || '0');
  
          star.addEventListener('mouseenter', () => {
            highlightStars(stars2, value);
          });
  
          star.addEventListener('mouseleave', () => {
            highlightStars(stars2, driverBehaviourRating);
          });
  
          star.addEventListener('click', () => {
            driverBehaviourRating = value;
            highlightStars(stars2, driverBehaviourRating);
          });
        });
  
        // Hover and click handling for the third set of stars
        stars3.forEach(star => {
          const value = parseInt(star.getAttribute('data-value') || '0');
  
          star.addEventListener('mouseenter', () => {
            highlightStars(stars3, value);
          });
  
          star.addEventListener('mouseleave', () => {
            highlightStars(stars3, vehicleRating);
          });
  
          star.addEventListener('click', () => {
            vehicleRating = value;
            highlightStars(stars3, vehicleRating);
          });
        });

        // Hover and click handling for the fourth set of stars
        stars4.forEach(star => {
          const value = parseInt(star.getAttribute('data-value') || '0');
  
          star.addEventListener('mouseenter', () => {
            highlightStars(stars4, value);
          });
  
          star.addEventListener('mouseleave', () => {
            highlightStars(stars4, onTimeRating);
          });
  
          star.addEventListener('click', () => {
            onTimeRating = value;
            highlightStars(stars4, onTimeRating);
          });
        });
  
        function highlightStars(starSet: NodeListOf<Element>, rating: number) {
          starSet.forEach(star => {
            const starValue = parseInt(star.getAttribute('data-value') || '0');
            (star as HTMLElement).style.color = starValue <= rating ? '#f5b301' : '#ccc';
          });
        }
      }
    })

    this.review = {
      ride: this.rideDetail._id,
      overallRating: overallRating,
      vehicleRating: vehicleRating,
      onTimeRating: onTimeRating,
      driverBehaviourRating: driverBehaviourRating,
      comment: comment
    }

    if (overallRating !== 0 || driverBehaviourRating !== 0 || vehicleRating !== 0 || onTimeRating !== 0) {
      this.addReview();
    }


    // console.log("review", this.review);   
  }

  addReview(){
    this.spinner.show();

    this.reviewService.addReview(this.review).subscribe({
      next: (result: any) => {
        if(result.statusCode === 201){
          this.spinner.hide();
          console.log("review added data", result);

          Swal.fire({
                title: "Review Added!",
                text: "Your review has been added.",
                icon: "success",
                confirmButtonText: "Ok"
              }).then((result) => {
                if (result.isConfirmed) {
                  // Swal.fire("Saved!", "", "success");
                }
              });

          this.getRideById(this.rideId);
        }
      },
      error: (error: any) => {
        this.spinner.hide();
        console.log("review added data error", error.error);
        this.toaster.error(error.error.message);
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

}
